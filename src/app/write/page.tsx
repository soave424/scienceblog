"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImagePlus, Send, Sparkles, Save, Trash2, Loader2 } from "lucide-react";
import { aiRealtimeWritingCoach } from "@/ai/flows/ai-realtime-writing-coach-flow";
import { aiImageObservationGuidance } from "@/ai/flows/ai-image-observation-guidance";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function WritePage() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<
    { role: "ai" | "user"; text: string }[]
  >([
    {
      role: "ai",
      text: "안녕하세요! 탐험 대원님. 오늘 관찰한 사진을 올리거나 내용을 적어보세요. 제가 더 멋진 관찰을 할 수 있도록 도와드릴게요!",
    },
  ]);
  const [isCoachLoading, setIsCoachLoading] = useState(false);
  const [isImageAnalyzing, setIsImageAnalyzing] = useState(false);
  const coachTimer = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle actual file upload
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "이미지 파일이 아닙니다",
        description: "사진 파일(jpg, png 등)만 올릴 수 있어요.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUri = event.target?.result as string;
      setImages((prev) => [...prev, dataUri]);

      // Trigger AI Vision analysis
      await triggerVisionGuidance(dataUri);
    };
    reader.readAsDataURL(file);

    // Reset input so the same file can be selected again
    e.target.value = "";
  };

  const triggerVisionGuidance = async (imageUrl: string) => {
    setIsImageAnalyzing(true);
    setChatMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: "탐험 대원님이 올린 사진을 돋보기로 자세히 살펴보고 있어요... 잠시만요!",
      },
    ]);

    try {
      const result = await aiImageObservationGuidance({
        imageDataUri: imageUrl,
        context: "초등 과학 관찰 (나비, 식물 등 생태 관찰)",
      });

      if (result.questions && result.questions.length > 0) {
        // Add a friendly intro from AI
        setChatMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "사진을 보니 이런 것들이 궁금해졌어요! 관찰 일지에 답을 적어볼까요?",
          },
        ]);

        result.questions.forEach((q) => {
          const safeQuestion = String(q || "").trim();
          if (safeQuestion) {
            setChatMessages((prev) => [
              ...prev,
              { role: "ai", text: `🔍 ${safeQuestion}` },
            ]);
          }
        });
      }
    } catch (e) {
      console.error(e);
      toast({
        variant: "destructive",
        title: "이미지 분석 오류",
        description:
          "AI가 사진을 분석하는 중에 문제가 생겼어요. 다시 시도해볼까요?",
      });
    } finally {
      setIsImageAnalyzing(false);
    }
  };

  // Real-time Writing Coach with Debounce
  useEffect(() => {
    const safeContent = String(content || "").trim();
    if (!safeContent || safeContent.length < 15) return;

    if (coachTimer.current) clearTimeout(coachTimer.current);

    coachTimer.current = setTimeout(async () => {
      setIsCoachLoading(true);
      try {
        const result = await aiRealtimeWritingCoach({
          reportText: safeContent,
        });
        if (result.feedback) {
          setChatMessages((prev) => [
            ...prev,
            { role: "ai", text: String(result.feedback || "").trim() },
          ]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsCoachLoading(false);
      }
    }, 4000);

    return () => {
      if (coachTimer.current) clearTimeout(coachTimer.current);
    };
  }, [content]);

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      suppressHydrationWarning
    >
      <main className="flex-1 flex overflow-hidden">
        {/* Main Editor Section */}
        <div className="flex-1 overflow-y-auto p-6" suppressHydrationWarning>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 mr-4">
                <Input
                  placeholder="오늘의 관찰 제목을 지어주세요!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-headline text-3xl font-black border-none bg-transparent focus-visible:ring-0 px-0 h-auto text-primary placeholder:text-primary/30"
                />
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-bold">
                  <span className="bg-primary/10 px-3 py-1 rounded-full text-primary">
                    탐험 대원 기록
                  </span>
                  <span>|</span>
                  <span>오늘의 날씨: 맑음 ☀️</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  className="rounded-2xl border-2 font-bold hover:bg-primary/5"
                >
                  <Save className="h-4 w-4 mr-2" /> 임시 저장
                </Button>
                <Button className="rounded-2xl font-black shadow-lg shadow-primary/20 px-8 bg-primary hover:bg-primary/90">
                  발행하기
                </Button>
              </div>
            </div>

            <Separator className="h-1 bg-primary/10 rounded-full" />

            <div className="space-y-8">
              {/* Image Upload Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white bg-muted group shadow-xl hover:scale-105 transition-transform"
                  >
                    <Image
                      src={img}
                      alt={`Observation ${idx}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== idx))
                      }
                      className="absolute top-3 right-3 p-2 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImageAnalyzing}
                  className={cn(
                    "aspect-video rounded-[2rem] border-4 border-dashed border-primary/30 flex flex-col items-center justify-center gap-3 hover:bg-primary/5 hover:border-primary/60 transition-all text-primary/60 group bg-white shadow-inner",
                    isImageAnalyzing && "opacity-50 cursor-not-allowed",
                  )}
                >
                  {isImageAnalyzing ? (
                    <Loader2 className="h-10 w-10 animate-spin text-accent" />
                  ) : (
                    <ImagePlus className="h-10 w-10 group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-sm font-black">
                    {isImageAnalyzing ? "분석 중..." : "관찰 사진 올리기"}
                  </span>
                </button>
              </div>

              {/* Text Area with Coaching Trigger */}
              <div className="relative bg-white rounded-[3rem] p-10 shadow-inner border-2 border-primary/5 min-h-[600px]">
                <Textarea
                  placeholder="여기에 관찰한 내용을 솔직하게 적어보세요.&#10;예: 배추흰나비 애벌레가 오늘 아침에 허물을 벗었어요. 몸 색깔이 더 밝은 초록색이 되었고..."
                  className="min-h-[500px] text-xl leading-relaxed border-none focus-visible:ring-0 resize-none p-0 bg-transparent font-medium placeholder:text-muted-foreground/30"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* AI Sidebar */}
        <aside
          className="w-[400px] border-l-4 border-primary/10 bg-white flex flex-col shadow-2xl z-10"
          suppressHydrationWarning
        >
          <div className="p-8 border-b bg-primary/5">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl rotate-3 animate-float">
                <Sparkles className="h-8 w-8" />
              </div>
              <div>
                <h2 className="font-headline font-black text-2xl text-primary leading-none mb-1">
                  AI 탐험 코치
                </h2>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  Real-time Coaching
                </p>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex flex-col gap-2 max-w-[95%] animate-in fade-in slide-in-from-bottom-2",
                    msg.role === "ai"
                      ? "self-start"
                      : "self-end items-end ml-auto",
                  )}
                >
                  <div
                    className={cn(
                      "p-5 rounded-[2rem] text-[15px] leading-relaxed shadow-md border-2",
                      msg.role === "ai"
                        ? "bg-white text-foreground rounded-tl-none border-primary/10"
                        : "bg-primary text-white rounded-tr-none border-primary shadow-primary/20 font-bold",
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isCoachLoading && (
                <div className="flex items-center gap-3 text-primary font-bold text-sm animate-pulse p-4 bg-primary/5 rounded-2xl">
                  <Loader2 className="h-5 w-5 animate-spin text-accent" />
                  AI 코치가 대원님의 글을 읽고 있어요...
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-8 border-t bg-muted/30">
            <div className="relative">
              <Input
                placeholder="코치님에게 질문해보세요!"
                className="pr-14 rounded-[1.5rem] border-4 border-white py-8 px-6 text-base font-bold shadow-lg focus-visible:ring-primary focus-visible:border-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value;
                    const safeVal = String(val || "").trim();
                    if (!safeVal) return;
                    setChatMessages((prev) => [
                      ...prev,
                      { role: "user", text: safeVal },
                    ]);
                    (e.target as HTMLInputElement).value = "";

                    // Artificial AI response for interactivity
                    setTimeout(() => {
                      setChatMessages((prev) => [
                        ...prev,
                        {
                          role: "ai",
                          text: "좋은 질문이에요! 그 부분은 관찰 일지에 숫자로 더 자세히 기록하면 완벽할 것 같아요.",
                        },
                      ]);
                    }, 1000);
                  }
                }}
              />
              <Button
                size="icon"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 bg-primary hover:bg-primary/90 rounded-2xl shadow-lg"
              >
                <Send className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
