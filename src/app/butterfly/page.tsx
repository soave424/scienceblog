"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Camera, Play, ArrowRight, Info, CheckCircle2 } from "lucide-react";
import { generateTargetedObservationPrompts } from "@/ai/flows/ai-targeted-observation-prompts";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ButterflyPage() {
  const [activeStage, setActiveStage] = useState("알");
  const [prompts, setPrompts] = useState<string[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(false);
  const { toast } = useToast();

  const stages = [
    { name: "알", id: "egg", image: PlaceHolderImages[0]?.imageUrl || "https://picsum.photos/seed/egg/800/600" },
    { name: "애벌레", id: "larva", image: PlaceHolderImages[1]?.imageUrl || "https://picsum.photos/seed/larva/800/600" },
    { name: "번데기", id: "pupa", image: PlaceHolderImages[2]?.imageUrl || "https://picsum.photos/seed/pupa/800/600" },
    { name: "성충", id: "adult", image: PlaceHolderImages[3]?.imageUrl || "https://picsum.photos/seed/adult/800/600" },
  ];

  useEffect(() => {
    loadPrompts(activeStage);
  }, [activeStage]);

  const loadPrompts = async (stage: string) => {
    setIsLoadingPrompts(true);
    try {
      const result = await generateTargetedObservationPrompts({ lifeCycleStage: stage });
      setPrompts(result.observationPrompts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPrompts(false);
    }
  };

  const handleCapture = () => {
    toast({
      title: "화면 캡처 완료!",
      description: "캡처한 이미지가 '관찰 일지 작성' 에디터로 자동 전송되었습니다.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Media Viewer */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="font-headline text-3xl font-bold text-primary">나비 한살이 가상 관찰</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCapture} className="rounded-xl">
                  <Camera className="mr-2 h-4 w-4" /> 현재 화면 캡처
                </Button>
                <Button className="rounded-xl shadow-lg shadow-primary/20">
                  <Play className="mr-2 h-4 w-4" /> 영상 재생
                </Button>
              </div>
            </div>

            <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem] bg-black aspect-video relative group">
              <Image 
                src={stages.find(s => s.name === activeStage)?.image || ""} 
                alt={activeStage}
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                <p className="text-white text-lg font-medium">배추흰나비 {activeStage} 단계 관찰 중...</p>
              </div>
            </Card>

            <div className="grid grid-cols-4 gap-4">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.name)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-2xl transition-all border-2",
                    activeStage === stage.name 
                      ? "bg-primary border-primary text-white shadow-xl scale-105" 
                      : "bg-white border-transparent text-muted-foreground hover:bg-muted"
                  )}
                >
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white/50">
                    <Image src={stage.image} alt={stage.name} fill className="object-cover" />
                  </div>
                  <span className="text-sm font-bold">{stage.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Observation Sidebar */}
          <aside className="w-full md:w-[400px] space-y-6">
            <Card className="border-none shadow-lg rounded-3xl bg-white overflow-hidden">
              <CardHeader className="bg-accent/10 border-b border-accent/20">
                <CardTitle className="font-headline text-primary flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI 관찰 가이드
                </CardTitle>
                <CardDescription>
                  {activeStage} 단계에서 무엇을 관찰해야 할까요?
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingPrompts ? (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-20 bg-muted rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prompts.map((prompt, idx) => (
                      <div key={idx} className="flex gap-3 p-4 bg-muted/50 rounded-2xl border border-border group hover:border-primary/30 transition-colors">
                        <CheckCircle2 className="h-5 w-5 text-primary/40 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                        <p className="text-sm font-medium leading-relaxed">{prompt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg rounded-3xl bg-primary text-white">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" /> 관찰 팁
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <p className="text-sm opacity-90 leading-relaxed">
                  배추흰나비의 {activeStage} 단계를 자세히 살펴볼 때는 색깔의 미묘한 변화와 표면의 질감에 집중해보세요. 
                  캡처한 이미지는 자동으로 관찰 일지에 저장됩니다.
                </p>
                <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">
                  일지 작성하러 가기 <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
