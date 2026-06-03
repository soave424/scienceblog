
"use client";

import Link from "next/link";
import { BookOpen, Microscope, Sparkles, PenTool, LayoutDashboard } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "대시보드", href: "/", icon: LayoutDashboard },
    { name: "관찰 일지 작성", href: "/write", icon: PenTool },
    { name: "관찰 연습 (사실vs의견)", href: "/practice", icon: Microscope },
    { name: "나비 한살이 탐구", href: "/butterfly", icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-primary">
            Scholarly Science Log
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
            JS
          </div>
        </div>
      </div>
    </header>
  );
}
