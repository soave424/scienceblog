"use client";

import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenTool, Microscope, Sparkles, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

export default function Home() {
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
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-headline text-4xl font-bold text-primary mb-2">안녕하세요, 지수 학생!</h1>
              <p className="text-muted-foreground text-lg">오늘도 과학적인 눈으로 세상을 관찰해볼까요?</p>
            </div>
            <Link href="/write">
              <Button size="lg" className="rounded-xl shadow-xl shadow-primary/20">
                <PenTool className="mr-2 h-5 w-5" />
                새 관찰 일지 쓰기
              </Button>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-headline text-2xl font-bold">최근 관찰 기록</h2>
                <Button variant="ghost" className="text-primary">전체 보기 <ArrowRight className="ml-2 h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentLogs.map((log) => (
                  <Card key={log.id} className="overflow-hidden group hover:shadow-lg transition-all border-none shadow-sm">
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={log.image}
                        alt={log.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        data-ai-hint="science observation"
                      />
                      <div className="absolute top-2 right-2">
                        <span className={cn(
                          "px-2 py-1 rounded-md text-xs font-bold",
                          log.status === "작성 중" ? "bg-accent text-white" : "bg-primary text-white"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <CardTitle className="text-lg">{log.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {log.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-4">
                      <Link href="/write">
                        <Button variant="outline" className="w-full">이어 쓰기</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                  <Sparkles className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold mb-2 text-primary">오늘의 추천 미션</h3>
                  <p className="text-muted-foreground mb-6">
                    나비의 번데기 과정 영상을 캡처하여, '사실' 중심의 관찰 문장을 3개 이상 작성해보세요.
                  </p>
                  <Link href="/butterfly">
                    <Button variant="secondary" className="bg-accent/10 text-primary hover:bg-accent/20">미션 수행하기</Button>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-primary text-white">
                <CardTitle className="text-lg font-headline">관찰 통계</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">누적 일지</span>
                    <span className="font-bold text-lg">12개</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">객관적 문장 비율</span>
                    <span className="font-bold text-lg text-accent">85%</span>
                  </div>
                  <div className="pt-2">
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-accent w-[85%]" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">지난 주 대비 5% 향상되었습니다!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-headline">핵심 도구</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Link href="/practice" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Microscope className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">사실/의견 분석기</p>
                    <p className="text-xs text-muted-foreground">문장의 객관성을 체크해요</p>
                  </div>
                </Link>
                <Link href="/butterfly" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
                  <div className="bg-accent/10 p-2 rounded-lg text-accent">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">나비 탐구</p>
                    <p className="text-xs text-muted-foreground">가상 관찰 자원을 활용해요</p>
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
