import { useState } from "react";
import { useFsmaStatus } from "@/hooks/use-fsma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { LayoutShell } from "@/components/layout-shell";

const QUESTIONS = [
  {
    id: "q1",
    question: "Do you grow, harvest, pack, or hold produce on your farm?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  },
  {
    id: "q2",
    question: "Is your produce exclusively on the 'rarely consumed raw' list (e.g., potatoes, pumpkins)?",
    options: [
      { value: "yes", label: "Yes, 100% of it" },
      { value: "no", label: "No, we grow other crops" }
    ]
  },
  {
    id: "q3",
    question: "What are your average annual produce sales (3-year average)?",
    options: [
      { value: "low", label: "Less than $25,000" },
      { value: "mid", label: "$25,000 - $500,000" },
      { value: "high", label: "More than $500,000" }
    ]
  },
  {
    id: "q4",
    question: "Do you sell more than 50% of your food directly to qualified end-users (consumers, restaurants, or retailers within 275 miles)?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" }
    ]
  }
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { updateStatus, isUpdating } = useFsmaStatus();
  const [, setLocation] = useLocation();

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[step].id]: value }));
  };

  const calculateStatus = () => {
    // Logic as per FSMA rules
    if (answers.q1 === "no") return { isCovered: false, isExempt: true, exemptionType: "none" }; // Not a farm
    if (answers.q2 === "yes") return { isCovered: false, isExempt: true, exemptionType: "rarely_consumed_raw" };
    if (answers.q3 === "low") return { isCovered: false, isExempt: true, exemptionType: "micro_business" };
    
    if (answers.q3 === "mid" && answers.q4 === "yes") {
      return { isCovered: true, isExempt: true, exemptionType: "qualified" };
    }
    
    return { isCovered: true, isExempt: false, exemptionType: "none" };
  };

  const handleNext = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(prev => prev + 1);
    } else {
      const result = calculateStatus();
      updateStatus({
        ...result,
        annualSales: answers.q3,
        details: answers
      }, {
        onSuccess: () => setLocation("/dashboard")
      });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(prev => prev - 1);
  };

  const currentQ = QUESTIONS[step];

  return (
    <LayoutShell>
      <div className="max-w-2xl mx-auto py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground">FSMA Compliance Wizard</h1>
          <p className="text-muted-foreground mt-2">Let's determine your farm's standing with the Produce Safety Rule.</p>
        </div>

        <div className="relative">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <Card className="mt-8 shadow-xl border-border/50">
            <CardHeader>
              <CardDescription className="uppercase tracking-wider text-xs font-bold text-primary">
                Question {step + 1} of {QUESTIONS.length}
              </CardDescription>
              <CardTitle className="text-2xl pt-2">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={answers[currentQ.id]} onValueChange={handleAnswer} className="space-y-4">
                {currentQ.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${currentQ.id}-${option.value}`} />
                    <Label 
                      htmlFor={`${currentQ.id}-${option.value}`}
                      className="text-base font-medium cursor-pointer py-2 pl-2 w-full hover:bg-secondary/50 rounded-md transition-colors"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-between pt-6 border-t border-border/50 bg-secondary/20">
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                disabled={step === 0}
                className="hover:bg-background"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={handleNext} 
                disabled={!answers[currentQ.id] || isUpdating}
                className="bg-primary hover:bg-primary/90"
              >
                {step === QUESTIONS.length - 1 ? (isUpdating ? "Saving..." : "Finish") : "Next"}
                {!isUpdating && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </LayoutShell>
  );
}
