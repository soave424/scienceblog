
"use client";

import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Microscope, Sparkles, ArrowRight, Clock, Star, Trophy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useUser } from "@/firebase";

export default function Home() {
  const { user } = useUser();
  const recentLogs = [
    { 
      id: 1, 
      title: "배추흰나비 애벌레 관찰", 
      date: "2026-06-02", 
      status: "작성 중", 
      image: PlaceHolderImages?.[1]?.imageUrl || "https://picsum.photos/seed/placeholder-1/400/300" 
    },
    { 
      id: 2, 
      title: "강낭콩의 싹 트는 과정", 
      date: "2026-05-28", 
      status: "완료", 
      image: PlaceHolderImages?.[4]?.imageUrl || "https://picsum.photos/seed/beans/400/300" 
    },
  ];

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <Header />
      <main className="container mx-auto py-10 px-4">
        <section className="mb-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-white p-8 rounded-[3rem] shadow-sm border-2 border-primary/10">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full border-4 border-accent overflow-hidden shadow-lg bg-accent/20">
                <img src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid || 'guest'}`} alt="Profile" />
              </div>
              <div>
                <h1 className="font-headline text-3xl font-black text-primary mb-1">
                  안녕, {user?.displayName || '반가운'} 대원!
                </h1>
                <p className="text-muted-foreground font-bold flex items-center gap-2">
                  <Star className="h-4 w-4 text-accent fill-accent" /> 오늘은 어떤 비밀을 찾아볼까?
                </p>
              </div>
            </div>
            <Link href="/write">
              <Button size="lg" className="rounded-2xl px-10 py-8 text-xl font-black shadow-xl bg-primary hover:bg-primary/90">
                <PenTool className="mr-3 h-6 w-6" />
                새 관찰 일지 쓰기
              </Button>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl font-black flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" /> 나의 최근 탐험 기록
                </h2>
                <Button variant="ghost" className="text-primary font-bold">전체 보기 <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentLogs.map((log) => (
                  <Card key={log.id} className="overflow-hidden group hover:shadow-2xl transition-all border-none shadow-md rounded-[2.5rem] bg-white">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={log.image}
                        alt={log.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        data-ai-hint="science observation"
                      />
                      <div className="absolute top-4 right-4">
                        <span className={cn(
                          "px-4 py-1 rounded-full text-xs font-black shadow-sm",
                          log.status === "작성 중" ? "bg-accent text-accent-foreground" : "bg-primary text-white"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl font-black text-primary">{log.title}</CardTitle>
                      <CardDescription className="font-bold">{log.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <Link href="/write">
                        <Button variant="outline" className="w-full rounded-xl py-6 font-bold border-2 border-primary/20 hover:bg-primary/5">이어 쓰기</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="bg-accent/10 rounded-[3rem] p-10 shadow-sm border-2 border-accent/20 relative overflow-hidden group">
              <div className="absolute -right-10 -top-10 text-accent/10 group-hover:rotate-12 transition-transform duration-500">
                <Sparkles size={200} />
              </div>
              <div className="flex items-start gap-6 relative z-10">
                <div className="p-5 bg-accent rounded-3xl text-accent-foreground shadow-lg">
                  <Sparkles className="h-10 w-10 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-headline text-3xl font-black mb-3 text-primary">오늘의 비밀 미션!</h3>
                  <p className="text-lg font-bold text-muted-foreground mb-8">
                    나비 번데기 영상을 캡처해서,<br/>"사실"만 담긴 멋진 문장을 3개 적어볼까요?
                  </p>
                  <Link href="/butterfly">
                    <Button className="rounded-2xl px-8 py-6 text-lg font-black bg-accent text-accent-foreground hover:bg-accent/90 shadow-md">미션 시작하기!</Button>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <Card className="border-none shadow-xl overflow-hidden rounded-[3rem] bg-white">
              <CardHeader className="bg-primary p-8 text-white">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-accent" /> 탐험 통계
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-muted/50 p-4 rounded-2xl">
                    <span className="font-bold text-muted-foreground">찾아낸 비밀</span>
                    <span className="font-black text-2xl text-primary">12개</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <span className="font-bold text-muted-foreground">객관성 지수</span>
                      <span className="font-black text-xl text-accent">85%</span>
                    </div>
                    <div className="h-4 w-full bg-muted rounded-full overflow-hidden border-2 border-muted shadow-inner">
                      <div className="h-full bg-accent w-[85%] rounded-full transition-all duration-1000" />
                    </div>
                    <p className="text-xs font-bold text-center text-primary mt-3">천재 과학자가 되어가고 있어요! 👏</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[3rem] bg-white p-2">
              <CardHeader className="p-6 pb-2">
                <CardTitle className="text-lg font-black text-primary">탐험 도구 상자</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-4">
                <Link href="/practice" className="flex items-center gap-4 p-5 rounded-3xl bg-secondary/30 hover:bg-secondary/60 transition-all group">
                  <div className="bg-primary p-3 rounded-2xl text-white group-hover:rotate-12 transition-transform">
                    <Microscope className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-md font-black text-primary">사실 판별기</p>
                    <p className="text-xs font-bold text-muted-foreground">진짜 사실인지 확인해요!</p>
                  </div>
                </Link>
                <Link href="/butterfly" className="flex items-center gap-4 p-5 rounded-3xl bg-accent/10 hover:bg-accent/20 transition-all group">
                  <div className="bg-accent p-3 rounded-2xl text-accent-foreground group-hover:rotate-12 transition-transform">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-md font-black text-accent-foreground">나비 탐험관</p>
                    <p className="text-xs font-bold text-muted-foreground">나비의 비밀을 관찰해요!</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
