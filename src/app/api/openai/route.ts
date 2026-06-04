import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, increment } from "firebase-admin/firestore";

// 초기화 (서버 런타임에서 한 번만)
if (getApps().length === 0) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (serviceAccount) {
      initializeApp({ credential: cert(JSON.parse(serviceAccount)) });
    } else {
      // 만약 Vercel 등에서 애플리케이션 기본 자격증명을 사용하도록 설정했다면 그냥 초기화합니다.
      initializeApp();
    }
  } catch (e) {
    console.error("Firebase admin init failed", e);
  }
}

const auth = getAuth();
const db = getFirestore();

const QUOTA_TOKENS = Number(process.env.AI_QUOTA_TOKENS || "100000"); // 기본 월별 토큰 허용량

function estimateTokensFromPayload(obj: any) {
  // 간이 추정: 문자열 길이 / 4 (정확하진 않음). 필요하면 클라이언트에서 토큰 추정기를 사용하세요.
  try {
    return Math.max(1, Math.ceil(JSON.stringify(obj).length / 4));
  } catch (e) {
    return 1;
  }
}

export async function POST(req: NextRequest) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey)
    return new NextResponse("OpenAI key not configured", { status: 500 });

  const authHeader = req.headers.get("authorization") || "";
  const idToken = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  if (!idToken)
    return new NextResponse("Missing Firebase ID token", { status: 401 });

  let uid: string;
  try {
    const decoded = await auth.verifyIdToken(idToken);
    uid = decoded.uid;
  } catch (e: any) {
    console.error("Invalid ID token", e);
    return new NextResponse("Invalid ID token", { status: 401 });
  }

  const body = await req.json();

  // 간단한 입력 검증
  const requestTokens = estimateTokensFromPayload(body);

  const monthKey = new Date().toISOString().slice(0, 7); // YYYY-MM
  const docRef = db.collection("aiUsage").doc(uid);
  const doc = await docRef.get();
  const data = doc.exists ? doc.data() : null;
  const usedTokens =
    data?.month === monthKey ? Number(data?.usedTokens || 0) : 0;

  if (usedTokens + requestTokens > QUOTA_TOKENS) {
    return new NextResponse("Quota exceeded", { status: 403 });
  }

  // 프록시 요청 (OpenAI)
  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify(body),
    });

    const respBody = await resp.json();

    // 응답 토큰(간이 추정) 합산
    const responseTokens = estimateTokensFromPayload(respBody);
    const totalTokens = requestTokens + responseTokens;

    // 사용량 업데이트
    await docRef.set(
      { month: monthKey, usedTokens: increment(totalTokens) },
      { merge: true },
    );

    return NextResponse.json(respBody, { status: resp.status });
  } catch (e: any) {
    console.error("OpenAI proxy error", e);
    return new NextResponse("Proxy error", { status: 500 });
  }
}
