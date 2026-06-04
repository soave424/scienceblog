"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImagePlus, Send, Sparkles, Save, Trash2 } from "lucide-react";
import { aiRealtimeWritingCoach } from "@/ai/flows/ai-realtime-writing-coach-flow";
import { aiImageObservationGuidance } from "@/ai/flows/ai-image-observation-guidance";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function WritePage() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: "안녕하세요! 오늘 관찰한 내용을 적어보세요. 제가 더 정교한 관찰을 할 수 있도록 도와드릴게요." }
  ]);
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const coachTimer = useRef<NodeJS.Timeout | null>(null);

  // Simulation of image upload
  const handleAddImage = () => {
    if (!PlaceHolderImages || PlaceHolderImages.length === 0) {
      toast({
        variant: "destructive",
        title: "이미지를 찾을 수 없습니다",
        description: "샘플 이미지 데이터가 없습니다.",
      });
      return;
    }
    const randomImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
    if (randomImage?.imageUrl) {
      setImages(prev => [...prev, randomImage.imageUrl]);
      triggerVisionGuidance(randomImage.imageUrl);
    }
  };

  const triggerVisionGuidance = async (imageUrl: string) => {
    try {
      setChatMessages(prev => [...prev, { role: 'ai', text: "이미지를 분석 중입니다..." }]);
      const result = await aiImageObservationGuidance({ 
        imageDataUri: imageUrl,
        context: "나비 한살이 또는 식물 관찰"
      });
      if (result.questions && result.questions.length > 0) {
        result.questions.forEach(q => {
          // Safe string handling with the recommended pattern
          const safeQuestion = String(q || "").trim();
          if (safeQuestion) {
            setChatMessages(prev => [...prev, { role: 'ai', text: safeQuestion }]);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Real-time Writing Coach with Debounce
  useEffect(() => {
    // Safe check for content using the recommended pattern
    const safeContent = String(content || "").trim();
    if (!safeContent || safeContent.length < 10) return;

    if (coachTimer.current) clearTimeout(coachTimer.current);

    coachTimer.current = setTimeout(async () => {
      setIsCoachLoading(true);
      try {
        const result = await aiRealtimeWritingCoach({ reportText: safeContent });
        if (result.feedback) {
          setChatMessages(prev => [...prev, { role: 'ai', text: String(result.feedback || "").trim() }]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsCoachLoading(false);
      }
    }, 3000);

    return () => {
      if (coachTimer.current) clearTimeout(coachTimer.current);
    };
  }, [content]);

  return (
    <div className="min-h-screen bg-background flex flex-col" suppressHydrationWarning>
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Main Editor Section */}
        <div className="flex-1 overflow-y-auto p-6" suppressHydrationWarning>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 mr-4">
                <Input 
                  placeholder="관찰 일지 제목을 입력하세요..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-headline text-2xl font-bold border-none bg-transparent focus-visible:ring-0 px-0 h-auto"
                />
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>작성자: 탐험 대원</span>
                  <span>|</span>
                  <span>최종 저장: 방금 전</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="rounded-xl">
                  <Save className="h-4 w-4 mr-2" /> 임시 저장
                </Button>
                <Button size="sm" className="rounded-xl">발행하기</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border bg-muted group shadow-md">
                    <Image src={img} alt={`Observation ${idx}`} fill className="object-cover" />
                    <button 
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button 
                  onClick={handleAddImage}
                  className="aspect-video rounded-xl border-4 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all text-muted-foreground group"
                >
                  <ImagePlus className="h-8 w-8 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold">사진 추가</span>
                </button>
              </div>

              <Textarea 
                placeholder="관찰한 사실을 객관적으로 기록해보세요..." 
                className="min-h-[500px] text-lg leading-relaxed border-none focus-visible:ring-0 resize-none p-0 bg-transparent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <aside className="w-[380px] border-l bg-white flex flex-col shadow-2xl" suppressHydrationWarning>
          <div className="p-6 border-b bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-headline font-black text-primary">실시간 코치</h2>
                <p className="text-[10px] text-muted-foreground font-bold">AI와 함께하는 관찰</p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={cn(
                  "flex flex-col gap-1 max-w-[90%]",
                  msg.role === 'ai' ? "self-start" : "self-end items-end ml-auto"
                )}>
                  <div className={cn(
                    "p-4 rounded-3xl text-sm leading-relaxed shadow-sm border-2",
                    msg.role === 'ai' 
                      ? "bg-muted/50 text-foreground rounded-tl-none border-border" 
                      : "bg-primary text-white rounded-tr-none border-primary shadow-primary/20"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isCoachLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs animate-pulse p-4">
                  <Sparkles className="h-4 w-4 animate-spin text-accent" />
                  AI 코치가 생각 중입니다...
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-6 border-t bg-muted/30">
            <div className="relative">
              <Input 
                placeholder="코치에게 질문하기..." 
                className="pr-12 rounded-2xl border-2 py-6"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value;
                    const safeVal = String(val || "").trim();
                    if (!safeVal) return;
                    setChatMessages(prev => [...prev, { role: 'user', text: safeVal }]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <Button size="icon" variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 text-primary hover:bg-primary/10 rounded-xl">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
