# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Firebase 설정 및 구글 로그인 활성화

1. Firebase 콘솔에서 새 프로젝트를 만들고 웹 앱을 등록합니다.
2. 프로젝트 설정에서 `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId` 값을 확인합니다.
3. 루트에 있는 `.env.local.example`을 `.env.local`로 복사하고 위 값을 채워 넣습니다.
4. Firebase 콘솔의 Authentication → Sign-in method에서 **Google** 제공자를 활성화합니다.
5. 개발 중에는 `Authorized domains`에 `localhost` (또는 사용 중인 도메인)를 추가하세요.
6. 로컬에서 서버를 재시작한 후 `/login` 페이지에서 "구글로 로그인" 버튼을 눌러 테스트합니다.

문제가 계속되면 `.env.local`이 올바르게 로드되었는지(`process.env.NEXT_PUBLIC_FIREBASE_API_KEY`)와 Firebase 콘솔에서 Google 제공자가 활성화되어 있는지 확인하세요.

## 권장 아키텍처: GitHub + Vercel + Firebase (AI 키 보안 및 자동 배포)

이 저장소는 다음 조합을 권장합니다:

- GitHub (코드 저장 및 CI) → Vercel (자동 배포 + 서버리스 함수)
- Firebase (인증, Firestore, Storage)

서버에서 AI 제공사 키(예: `OPENAI_API_KEY`)를 안전하게 다루려면 Vercel의 환경변수(Secrets)에 키를 넣고 클라이언트는 서버 프록시를 통해 요청해야 합니다.

### 예시: Vercel에 등록할 환경변수

- `OPENAI_API_KEY` — 서버 전용 (절대 `NEXT_PUBLIC_` 접두사 사용 금지)
- `FIREBASE_SERVICE_ACCOUNT` — Firebase Admin SDK용 서비스 계정 JSON (문자열화된 JSON)
- `AI_QUOTA_TOKENS` — 사용자별 월별 토큰 한도 (선택, 기본 100000)

### 이 저장소에 추가된 서버 프록시

`src/app/api/openai/route.ts` — 클라이언트에서 Firebase ID 토큰을 `Authorization: Bearer <idToken>` 헤더로 보내면 서버에서 토큰을 검증하고 Firestore(`aiUsage/{uid}`)에 사용자별 사용량을 기록한 뒤 OpenAI에 요청을 프록시합니다. 쿼터 초과 시 403을 반환합니다.

로컬에서 테스트하려면 `.env.local`에 `OPENAI_API_KEY`와(로컬 테스트용) `FIREBASE_SERVICE_ACCOUNT`를 넣고 개발 서버를 재시작하세요.
