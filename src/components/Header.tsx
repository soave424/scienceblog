"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Microscope,
  Sparkles,
  PenTool,
  LayoutDashboard,
  LogOut,
  LogIn,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser, useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { name: "나의 탐험", href: "/", icon: LayoutDashboard },
    { name: "관찰 일지", href: "/write", icon: PenTool },
    { name: "사실 판별기", href: "/practice", icon: Microscope },
    { name: "나비 탐험", href: "/butterfly", icon: Sparkles },
  ];

  if (!mounted) return null;

  return (
    <header
      className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
      suppressHydrationWarning
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        suppressHydrationWarning
      >
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={(e) => {}}
          >
            <span className="font-serif-fancy text-2xl font-bold tracking-wider text-brand-600 dark:text-brand-500">
              NATURA
            </span>
            <span className="text-xs bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 px-2 py-0.5 rounded-full font-semibold">
              DIARY
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {["전체", "식물·꽃", "조류·새", "곤충·소생물", "생태·숲"].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => {}}
                  className="px-4 py-2 rounded-lg text-sm transition-all text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  {cat}
                </button>
              ),
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="식물, 조류, 숲속 검색..."
              className="w-48 focus:w-64 transition-all duration-300 bg-slate-100 dark:bg-slate-800 border-none rounded-full py-1.5 pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 dark:text-slate-200"
            />
            <div className="absolute right-3 top-2 text-slate-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          <button
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
            aria-label="Toggle Dark Mode"
          >
            <svg
              className="w-5 h-5 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 7a5 5 0 110 10 5 5 0 010-10z"
              ></path>
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {user && !user.isAnonymous ? (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 pl-2 pr-1 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                <img
                  src={
                    user.photoURL ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"
                  }
                  className="w-6 h-6 rounded-full border border-brand-500 object-cover shadow-inner"
                  title={user.displayName}
                />
                <button
                  onClick={() => auth && signOut(auth)}
                  className="text-xs text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 px-2 py-1 rounded-lg transition font-medium flex items-center gap-1"
                  title="로그아웃"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => {}}
                className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition border border-slate-200 dark:border-slate-700"
              >
                구글 로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
