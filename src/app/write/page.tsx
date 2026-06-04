
"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ImagePlus, Send, Sparkles, Save, Trash2, Camera, AlertCircle } from "lucide-react";
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
          setChatMessages(prev => [...prev, { role: 'ai', text: q }]);
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Real-time Writing Coach with Debounce
  useEffect(() => {
    if (!content || content.length < 10) return;

    if (coachTimer.current) clearTimeout(coachTimer.current);

    coachTimer.current = setTimeout(async () => {
      setIsCoachLoading(true);
      try {
        const result = await aiRealtimeWritingCoach({ reportText: content });
        if (result.feedback) {
          setChatMessages(prev => [...prev, { role: 'ai', text: result.feedback }]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsCoachLoading(false);
      }
    }, 3000); // 3-second debounce

    return () => {
      if (coachTimer.current) clearTimeout(coachTimer.current);
    };
  }, [content]);

  return (
    <div className="min-h-screen bg-background flex flex-col" suppressHydrationWarning>
      <Header />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Main Editor Section */}
        <div className="flex-1 overflow-y-auto p-6">
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
                  <span>작성자: 지수 학생</span>
                  <span>|</span>
                  <span>최종 저장: 방금 전</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" /> 임시 저장
                </Button>
                <Button size="sm">발행하기</Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border bg-muted group">
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
                  className="aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors text-muted-foreground"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs font-medium">사진 추가</span>
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
        <aside className="w-[380px] border-l bg-white flex flex-col shadow-2xl">
          <div className="p-4 border-b bg-primary/5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="font-headline font-bold text-primary">실시간 글쓰기 코치</h2>
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
                    "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.role === 'ai' 
                      ? "bg-muted text-foreground rounded-tl-none border border-border" 
                      : "bg-primary text-white rounded-tr-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isCoachLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs animate-pulse p-2">
                  <Sparkles className="h-3 w-3 animate-spin" />
                  AI 코치가 생각 중입니다...
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t bg-muted/30">
            <div className="relative">
              <Input 
                placeholder="AI 코치에게 물어보세요..." 
                className="pr-10 rounded-xl"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const text = (e.target as HTMLInputElement).value;
                    if (!text) return;
                    setChatMessages(prev => [...prev, { role: 'user', text }]);
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
              <Button size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
