"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, CheckCircle2, FileQuestion, Send, ChevronRight, ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

// Mock Quiz Data
const QUIZ_DATA = {
  id: "q1",
  title: "Ulangan Harian: Subnetting IPv4",
  course: "Materi Komputer dan Jaringan Dasar",
  timeLimit: 30, // minutes
  questions: [
    {
      id: "q_1",
      type: "mcq",
      text: "Berapa jumlah host yang valid untuk subnet mask 255.255.255.224 (/27)?",
      options: ["30", "32", "62", "64", "14"],
    },
    {
      id: "q_2",
      type: "mcq",
      text: "Manakah dari berikut ini yang merupakan IP Private kelas C?",
      options: ["10.0.0.1", "172.16.0.1", "192.168.1.1", "11.11.11.11", "224.0.0.1"],
    },
    {
      id: "q_3",
      type: "essay",
      text: "Jelaskan langkah-langkah membagi sebuah network 192.168.10.0/24 menjadi 4 subjaringan (subnet) yang sama besar. Sebutkan Network ID dan Broadcast ID untuk subnet pertama!",
      options: null,
    }
  ]
};

export default function QuizPlayer() {
  const params = useParams();
  const router = useRouter();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(QUIZ_DATA.timeLimit * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const currentQuestion = QUIZ_DATA.questions[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === QUIZ_DATA.questions.length - 1;
  const isFirstQuestion = currentQuestionIdx === 0;

  useEffect(() => {
    if (isSubmitted) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted]);

  const handleAutoSubmit = () => {
    setIsSubmitted(true);
    // Simulate API submit call here
  };

  const handleSubmitManual = () => {
    if (confirm("Apakah Anda yakin ingin menyelesaikan kuis ini? Jawaban tidak dapat diubah setelah disubmit.")) {
      setIsSubmitted(true);
      // Simulate API submit call here
    }
  };

  const handleAnswerSelect = (opt: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: opt }));
  };

  const handleEssayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isTimeWarning = timeLeft < 300; // Less than 5 minutes

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full"
        >
          <Card className="text-center shadow-lg border-t-8 border-t-emerald-500">
            <CardHeader>
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <CardTitle className="text-2xl">Kuis Selesai!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Jawaban Anda berhasil disimpan. Nilai pilihan ganda akan dihitung secara otomatis, sementara essai menunggu penilaian dari guru.</p>
              <div className="bg-muted p-4 rounded-lg flex justify-between text-sm font-medium">
                <span>Soal Terjawab:</span>
                <span>{Object.keys(answers).length} / {QUIZ_DATA.questions.length}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => router.push('/dashboard')}>Kembali ke Dashboard</Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Quiz Header & Timer */}
      <div className="bg-card border rounded-2xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm sticky top-20 z-10 hidden-scrollbar">
        <div>
          <Badge variant="secondary" className="mb-2">{QUIZ_DATA.course}</Badge>
          <h1 className="text-xl md:text-2xl font-bold">{QUIZ_DATA.title}</h1>
        </div>
        
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl font-mono text-xl font-bold shadow-inner ${isTimeWarning ? 'bg-destructive/10 text-destructive border border-destructive/20 animate-pulse' : 'bg-muted text-foreground'}`}>
          <Clock className="w-5 h-5 shrink-0" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {/* Question Navigator */}
        <div className="md:col-span-1 space-y-4">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-semibold flex items-center">
                <FileQuestion className="w-4 h-4 mr-2" />
                Navigasi Soal
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-5 gap-2">
                {QUIZ_DATA.questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isActive = currentQuestionIdx === idx;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`
                        w-8 h-8 rounded-md text-xs font-bold flex items-center justify-center transition-all
                        ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                        ${isAnswered 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }
                      `}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                <div className="w-3 h-3 rounded-sm bg-primary"></div><span>Sudah dijawab</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
                <div className="w-3 h-3 rounded-sm bg-muted"></div><span>Belum dijawab</span>
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Question Content */}
        <div className="md:col-span-3">
          <Card className="shadow-sm overflow-hidden min-h-[400px] flex flex-col">
            <div className="bg-muted/40 p-4 border-b flex justify-between items-center">
              <span className="font-semibold text-sm">Soal {currentQuestionIdx + 1} dari {QUIZ_DATA.questions.length}</span>
              <Badge variant="outline" className="uppercase text-[10px] tracking-wider">{currentQuestion.type}</Badge>
            </div>
            
            <CardContent className="p-6 md:p-8 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-lg font-medium leading-relaxed mb-8 text-foreground/90">
                    {currentQuestion.text}
                  </p>

                  {currentQuestion.type === "mcq" && (
                    <div className="space-y-3">
                      {currentQuestion.options?.map((opt, i) => {
                        const isSelected = answers[currentQuestion.id] === opt;
                        return (
                          <div 
                            key={i}
                            onClick={() => handleAnswerSelect(opt)}
                            className={`
                              p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4
                              ${isSelected 
                                ? 'border-primary bg-primary/5 shadow-sm' 
                                : 'border-muted hover:border-primary/40 bg-card hover:bg-muted/20'
                              }
                            `}
                          >
                            <div className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0
                              ${isSelected ? 'border-primary' : 'border-muted-foreground/40'}
                            `}>
                              {isSelected && <div className="w-3 h-3 rounded-full bg-primary" />}
                            </div>
                            <span className="font-medium text-sm md:text-base">{opt}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {currentQuestion.type === "essay" && (
                    <textarea 
                      className="w-full min-h-[200px] p-4 rounded-xl border-2 border-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none bg-background text-sm md:text-base leading-relaxed"
                      placeholder="Ketikkan jawaban Anda di sini secara rinci dan jelas..."
                      value={answers[currentQuestion.id] || ""}
                      onChange={handleEssayChange}
                    ></textarea>
                  )}
                </motion.div>
              </AnimatePresence>
            </CardContent>
            
            <CardFooter className="p-4 md:p-6 bg-muted/20 border-t flex justify-between items-center mt-auto gap-4">
              <Button 
                variant="outline" 
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                disabled={isFirstQuestion}
                className="w-24 border-muted-foreground/30 hidden sm:flex"
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Prev
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                disabled={isFirstQuestion}
                className="sm:hidden shrink-0 border-muted-foreground/30"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              {!isLastQuestion ? (
                <Button 
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="w-full sm:w-auto sm:px-8 shadow-sm"
                >
                  Selanjutnya <ChevronRight className="w-4 h-4 ml-1 md:hidden" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmitManual}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <Send className="w-4 h-4 mr-2" /> Selesaikan Kuis
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
