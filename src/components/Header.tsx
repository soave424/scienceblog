
"use client";

import Link from "next/link";
import { BookOpen, Microscope, Sparkles, PenTool, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUser, useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";

export function Header() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();

  const navItems = [
    { name: "나의 탐험", href: "/", icon: LayoutDashboard },
    { name: "관찰 일지", href: "/write", icon: PenTool },
    { name: "사실 판별기", href: "/practice", icon: Microscope },
    { name: "나비 관찰", href: "/butterfly", icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 transition-transform group-hover:scale-110 group-hover:rotate-3">
            <BookOpen className="h-7 w-7" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-xl font-black tracking-tight text-primary leading-tight">
              사이언스 탐험대
            </span>
            <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
              Science Expedition
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:bg-primary/10",
                  isActive ? "bg-primary text-white hover:bg-primary/90 shadow-md" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "animate-bounce-subtle" : "")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-primary">{user.displayName} 대원</span>
                <span className="text-[10px] text-muted-foreground">탐험 레벨 1</span>
              </div>
              <div className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden shadow-sm">
                <img src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} alt="Profile" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => auth && signOut(auth)} className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                <LogIn className="mr-2 h-4 w-4" /> 로그인
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
