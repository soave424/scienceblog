"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 샘플 포스트 데이터
  const posts = [
    {
      id: 1,
      title: "숲속의 숨은 보석, 봄에 피는 봄꽃 야생화 관찰기",
      summary:
        "혹독한 겨울의 언 땅을 뚫고 가장 먼저 고개를 내미는 복수초와 바람꽃.",
      category: "식물·꽃",
      author: "숲길 산책자",
      date: "2026-06-02",
      readTime: 5,
      image:
        PlaceHolderImages?.[0]?.imageUrl ||
        "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=800&q=80",
      tags: ["야생화", "복수초", "봄꽃"],
      userId: "user1",
      userPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
      userDisplayName: "숲길 산책자",
    },
    {
      id: 2,
      title: "베란다 정원에 찾아온 박새 가족의 30일 이소 기록",
      summary:
        "인공 둥지 상자에 자리를 틀고 알을 낳아 새끼를 키워내기까지의 감동 기록.",
      category: "조류·새",
      author: "날개 지킴이",
      date: "2026-05-28",
      readTime: 6,
      image:
        PlaceHolderImages?.[1]?.imageUrl ||
        "https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=800&q=80",
      tags: ["박새", "육아일기", "조류"],
      userId: "user2",
      userPhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=user2",
      userDisplayName: "날개 지킴이",
    },
  ];

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast({
        variant: "destructive",
        title: "설정 오류",
        description: "Firebase 설정이 완료되지 않았습니다.",
      });
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Search Results Info */}
      {false && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-6 flex justify-between items-center bg-brand-50 dark:bg-brand-900/30 border border-brand-100 dark:border-brand-800 p-4 rounded-xl">
          <div className="text-sm">검색 결과</div>
          <button className="text-xs text-slate-400 hover:text-slate-600 underline">
            초기화
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Posts Feed */}
          <div className="lg:col-span-8 space-y-8">
            {/* Section Header */}
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <span className="w-1.5 h-6 bg-brand-600 rounded-full"></span>
                <span>관찰 일지 기록</span>
              </h3>
              <div className="text-xs text-slate-400">
                총{" "}
                <span className="text-slate-600 dark:text-slate-200 font-bold">
                  {posts.length}
                </span>
                개의 기록
              </div>
            </div>

            {/* Post Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-brand-200 dark:hover:border-slate-700 transition-all duration-300 flex flex-col group h-full"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 z-10 bg-white/95 dark:bg-slate-900/95 text-brand-600 dark:text-brand-400 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {post.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col justify-between flex-grow space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}분 분량</span>
                      </div>
                      <h4 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white line-clamp-2 hover:text-brand-600 cursor-pointer transition-colors">
                        {post.title}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.userPhoto}
                          alt={post.author}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {post.author}
                        </span>
                      </div>
                      <button className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-0.5 hover:gap-1 transition-all">
                        일지 읽기
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8 sticky top-24">
            {/* NATURA Profile Card */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <svg
                  className="w-40 h-40"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>

              <div className="relative z-10 space-y-4">
                <h4 className="font-serif-fancy text-xl font-bold tracking-wider text-emerald-100">
                  NATURA DIARY
                </h4>
                <p className="text-sm text-brand-100 leading-relaxed font-light">
                  발걸음이 닿는 전국의 숲과 정원에서 마주한 작은 야생화들,
                  찾아오는 숲새들의 생태 아카이브입니다.
                </p>

                {/* User Profile Section */}
                <div className="bg-emerald-800/40 p-4 rounded-2xl border border-white/20 space-y-3">
                  {user && !user.isAnonymous ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            user.photoURL ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                          }
                          alt={user.displayName || "User"}
                          className="w-10 h-10 rounded-full border border-white/40 object-cover shadow"
                        />
                        <div className="min-w-0 flex-grow">
                          <span className="block text-sm font-bold text-white truncate">
                            {user.displayName}
                          </span>
                          <span className="block text-[10px] text-emerald-200 truncate">
                            {user.email}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <span className="inline-block bg-white/20 text-white text-[9px] px-2 py-1 rounded font-bold uppercase tracking-wider">
                          구글 연동
                        </span>
                        <button
                          onClick={handleLogout}
                          className="text-white hover:text-red-200 text-xs px-2 py-1 rounded transition font-bold flex items-center gap-1"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            ></path>
                          </svg>
                          로그아웃
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-emerald-200 block font-semibold tracking-wider uppercase">
                          임시 네트워크 ID
                        </span>
                        <span className="text-[11px] font-mono select-all break-all text-emerald-100 block">
                          {user?.uid || "동기화 중..."}
                        </span>
                      </div>
                      <button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-emerald-700 hover:bg-brand-50 text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition shadow"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.71 0 3.28.62 4.5 1.643l2.425-2.424C17.433 1.583 14.99 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.24-4.11 10.24-10.24 0-.685-.06-1.352-.18-1.955H12.24z" />
                        </svg>
                        구글 계정 연동하기
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/20 pt-4 flex justify-between items-center text-xs">
                  <div>
                    <span className="block text-brand-200">등록된 일지</span>
                    <span className="text-lg font-bold">{posts.length}편</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-white/10 px-2.5 py-1 rounded-md text-[10px]">
                      #자연관찰
                    </span>
                    <span className="bg-white/10 px-2.5 py-1 rounded-md text-[10px]">
                      #야생화
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
