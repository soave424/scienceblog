
"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Microscope, CheckCircle2, AlertCircle, RefreshCcw, Sparkles } from "lucide-react";
import { analyzeFactOpinion, AiFactOpinionAnalyzerOutput } from "@/ai/flows/ai-fact-opinion-analyzer";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function PracticePage() {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<AiFactOpinionAnalyzerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const sampleImage = PlaceHolderImages?.[0];

  const handleAnalyze = async () => {
    if (!inputText) return;
    setIsLoading(true);
    try {
      const result = await analyzeFactOpinion({ observationText: inputText });
      setAnalysis(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setInputText("");
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <Header />
      <main className="container mx-auto py-10 px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="font-headline text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
            <Microscope className="h-8 w-8" />
            사실 vs 의견 판별 엔진
          </h1>
          <p className="text-muted-foreground text-lg">
            과학적 관찰은 주관적인 '느낌'이 아닌 객관적인 '사실'을 기록하는 것에서 시작합니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <Card className="border-none shadow-xl overflow-hidden">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
              {sampleImage?.imageUrl ? (
                <Image 
                  src={sampleImage.imageUrl} 
                  alt="Observation Mission" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground italic">
                  이미지 준비 중
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-3 text-sm">
                미션: 위 이미지를 보고 과학적 관찰 문장을 작성해보세요.
              </div>
            </div>
            <CardHeader className="p-6">
              <CardTitle className="text-lg">관찰 기록하기</CardTitle>
              <CardDescription>보이는 그대로를 숫지, 모양, 색깔 등을 사용하여 설명해보세요.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <Textarea 
                placeholder="예: 나비 알은 노란색이고 동그란 모양이며 잎 뒤쪽에 붙어 있습니다." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[150px] rounded-xl text-base"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={handleAnalyze} 
                  disabled={isLoading || !inputText}
                  className="flex-1 rounded-xl py-6 text-lg font-bold"
                >
                  {isLoading ? (
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                  )}
                  판별하기
                </Button>
                <Button variant="outline" onClick={handleReset} className="rounded-xl px-4">
                  <RefreshCcw className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {!analysis && !isLoading && (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border-2 border-dashed border-muted h-[400px] text-center">
                <div className="p-4 bg-primary/5 rounded-full mb-4">
                  <Microscope className="h-12 w-12 text-primary/40" />
                </div>
                <p className="text-muted-foreground">
                  왼쪽 창에 관찰 내용을 입력하고 <br/><b>'판별하기'</b> 버튼을 눌러보세요.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-lg h-[400px] text-center animate-pulse">
                <Sparkles className="h-12 w-12 text-accent mb-4 animate-bounce" />
                <p className="text-lg font-bold text-primary">AI가 문장을 분석하고 있습니다...</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-4" suppressHydrationWarning>
                <h3 className="font-headline text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                  분석 결과
                </h3>
                
                {analysis.hasSubjectiveStatements ? (
                  <div className="space-y-4">
                    <div className="bg-destructive/10 text-destructive p-4 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0 mt-1" />
                      <p className="font-medium">주관적인 표현이 포함되어 있습니다. 더 객관적으로 고쳐볼까요?</p>
                    </div>
                    {analysis.analysis.map((item, idx) => (
                      <Card key={idx} className="border-none shadow-md overflow-hidden bg-white">
                        <div className="p-4 border-l-4 border-destructive bg-destructive/5">
                          <p className="text-xs font-bold uppercase tracking-wider text-destructive mb-1">원문</p>
                          <p className="text-sm italic">"{item.originalStatement}"</p>
                        </div>
                        <CardContent className="p-4 space-y-3">
                          <div>
                            <p className="text-xs font-bold text-muted-foreground mb-1">이유</p>
                            <p className="text-sm">{item.subjectivityExplanation}</p>
                          </div>
                          <div className="bg-accent/10 p-3 rounded-xl border border-accent/20">
                            <p className="text-xs font-bold text-primary mb-1">추천 수정안</p>
                            <p className="text-sm font-semibold text-primary">{item.objectiveSuggestion}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="bg-primary/10 text-primary p-8 rounded-3xl flex flex-col items-center text-center gap-4">
                    <div className="h-16 w-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">참 잘했어요!</h4>
                      <p className="text-sm opacity-80">작성하신 문장은 모두 객관적인 사실을 기반으로 하고 있습니다. 훌륭한 과학자의 관찰입니다!</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
