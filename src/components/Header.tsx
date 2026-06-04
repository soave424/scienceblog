
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
    { name: "나비 탐험", href: "/butterfly", icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b-4 border-primary/10">
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-primary text-white shadow-xl shadow-primary/20 transition-all group-hover:scale-110 group-hover:rotate-6">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-2xl font-black tracking-tight text-primary leading-tight">
              사이언스 탐험대
            </span>
            <span className="text-xs text-muted-foreground font-black tracking-widest uppercase">
              Science Expedition
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-[1.5rem] text-base font-black transition-all",
                  isActive 
                    ? "bg-primary text-white shadow-lg scale-105" 
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "animate-bounce" : "")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-black text-primary">{user.displayName} 대원</span>
                <span className="text-[10px] font-black text-accent bg-accent/10 px-2 py-0.5 rounded-full">탐험 레벨 1</span>
              </div>
              <div className="h-12 w-12 rounded-full border-4 border-primary/20 overflow-hidden shadow-md">
                <img 
                  src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => auth && signOut(auth)} 
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="rounded-[1.5rem] bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-6 text-lg font-black shadow-lg">
                <LogIn className="mr-2 h-5 w-5" /> 로그인
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
