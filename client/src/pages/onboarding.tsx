import { useMemo, useState } from "react";
import { LayoutShell } from "@/components/layout-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, RotateCcw, Printer } from "lucide-react";

type YesNo = "yes" | "no";
type YesNoMaybe = "yes" | "no" | "not_sure";

type OutcomeType =
  | "not_covered_farm"
  | "not_covered_sales"
  | "not_covered_rarely"
  | "not_covered_personal"
  | "eligible_exemption_processing"
  | "qualified_exemption"
  | "covered";

type CommodityAnswer = {
  id: string;
  name: string;
  rarelyConsumedRaw?: YesNo;
  personalUse?: YesNo;
  processingKillStep?: YesNo;
  outcome?: OutcomeType;
  outcomeReason?: string;
};

type WizardStep =
  | "intro"
  | "q1"
  | "q2"
  | "commodities"
  | "commodity_q3"
  | "commodity_q4"
  | "commodity_q5"
  | "q6"
  | "not_sure_helper"
  | "result";

const OUTCOME_LABELS: Record<OutcomeType, string> = {
  not_covered_farm: "Not covered by the Produce Safety Rule",
  not_covered_sales: "Not covered by the Produce Safety Rule",
  not_covered_rarely: "Produce commodity not covered (rarely consumed raw)",
  not_covered_personal: "Produce not covered (personal/on-farm consumption)",
  eligible_exemption_processing:
    "Eligible for exemption (commercial processing with an adequate pathogen reduction “kill step”)",
  qualified_exemption: "Eligible for a qualified exemption (must comply with modified requirements + documentation)",
  covered: "Covered by the Produce Safety Rule (“YOU ARE COVERED BY THIS RULE.”)",
};

function createCommodity(name: string): CommodityAnswer {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `commodity-${Date.now()}`,
    name,
  };
}

export default function Onboarding() {
  const [step, setStep] = useState<WizardStep>("intro");
  const [q1, setQ1] = useState<YesNo | "">("");
  const [q2, setQ2] = useState<YesNo | "">("");
  const [commodities, setCommodities] = useState<CommodityAnswer[]>([createCommodity("Produce item")]);
  const [commodityIndex, setCommodityIndex] = useState(0);
  const [q6, setQ6] = useState<YesNoMaybe | "">("");
  const [provisional, setProvisional] = useState(false);

  const activeCommodity = commodities[commodityIndex];

  const resetAll = () => {
    setStep("intro");
    setQ1("");
    setQ2("");
    setCommodities([createCommodity("Produce item")]);
    setCommodityIndex(0);
    setQ6("");
    setProvisional(false);
  };

  const updateCommodity = (updates: Partial<CommodityAnswer>) => {
    setCommodities((prev) =>
      prev.map((commodity, index) => (index === commodityIndex ? { ...commodity, ...updates } : commodity))
    );
  };

  const computeCommodityOutcome = (commodity: CommodityAnswer): CommodityAnswer => {
    if (commodity.rarelyConsumedRaw === "yes") {
      return {
        ...commodity,
        outcome: "not_covered_rarely",
        outcomeReason: "This commodity is on the FDA list of produce rarely consumed raw.",
      };
    }
    if (commodity.personalUse === "yes") {
      return {
        ...commodity,
        outcome: "not_covered_personal",
        outcomeReason: "This produce is for personal/on-farm consumption.",
      };
    }
    if (commodity.processingKillStep === "yes") {
      return {
        ...commodity,
        outcome: "eligible_exemption_processing",
        outcomeReason:
          "This produce is intended for commercial processing that adequately reduces pathogens (a “kill step”).",
      };
    }
    return { ...commodity };
  };

  const commodityOutcomes = useMemo(() => {
    return commodities.map((commodity) => computeCommodityOutcome(commodity));
  }, [commodities]);

  const allCommoditiesExcluded = useMemo(() => {
    return commodityOutcomes.every(
      (commodity) =>
        commodity.outcome === "not_covered_rarely" || commodity.outcome === "not_covered_personal"
    );
  }, [commodityOutcomes]);

  const allCommoditiesExcludedOrProcessing = useMemo(() => {
    return commodityOutcomes.every(
      (commodity) =>
        commodity.outcome === "not_covered_rarely" ||
        commodity.outcome === "not_covered_personal" ||
        commodity.outcome === "eligible_exemption_processing"
    );
  }, [commodityOutcomes]);

  const hasProcessingExemption = useMemo(() => {
    return commodityOutcomes.some((commodity) => commodity.outcome === "eligible_exemption_processing");
  }, [commodityOutcomes]);

  const finalOutcome: { type: OutcomeType; reason: string } | null = useMemo(() => {
    if (q1 === "no") {
      return {
        type: "not_covered_farm",
        reason: "Your farm does not grow, harvest, pack, or hold produce.",
      };
    }
    if (q1 === "yes" && q2 === "yes") {
      return {
        type: "not_covered_sales",
        reason: "Your average annual produce sales are $25,000 or less.",
      };
    }
    if (q1 === "yes" && q2 === "no" && allCommoditiesExcludedOrProcessing && hasProcessingExemption) {
      return {
        type: "eligible_exemption_processing",
        reason:
          "All commodities are either excluded or intended for commercial processing with an adequate kill step.",
      };
    }
    if (q1 === "yes" && q2 === "no" && allCommoditiesExcluded) {
      return {
        type: "not_covered_farm",
        reason: "All commodities are excluded (rarely consumed raw or personal/on-farm consumption).",
      };
    }
    if (q6 === "yes") {
      return {
        type: "qualified_exemption",
        reason:
          "Your farm reports less than $500,000 in annual food sales and a majority of sales directly to qualified end-users.",
      };
    }
    if (q6 === "no" || (q6 === "not_sure" && provisional)) {
      return {
        type: "covered",
        reason: provisional
          ? "Provisional result based on a “not sure” response to the qualified exemption test."
          : "You did not meet the qualified exemption test based on the information provided.",
      };
    }
    return null;
  }, [q1, q2, q6, provisional, allCommoditiesExcluded, allCommoditiesExcludedOrProcessing, hasProcessingExemption]);

  const next = () => {
    if (step === "intro") return setStep("q1");
    if (step === "q1") {
      if (q1 === "no") return setStep("result");
      return setStep("q2");
    }
    if (step === "q2") {
      if (q2 === "yes") return setStep("result");
      return setStep("commodities");
    }
    if (step === "commodities") return setStep("commodity_q3");
    if (step === "commodity_q3") return setStep("commodity_q4");
    if (step === "commodity_q4") return setStep("commodity_q5");
    if (step === "commodity_q5") {
      const updated = computeCommodityOutcome(activeCommodity);
      setCommodities((prev) =>
        prev.map((commodity, index) => (index === commodityIndex ? updated : commodity))
      );
      if (commodityIndex < commodities.length - 1) {
        setCommodityIndex((prev) => prev + 1);
        return setStep("commodity_q3");
      }
      return setStep("q6");
    }
    if (step === "q6") {
      if (q6 === "not_sure") return setStep("not_sure_helper");
      return setStep("result");
    }
    if (step === "not_sure_helper") return setStep("result");
    if (step === "result") return setStep("result");
  };

  const back = () => {
    if (step === "q1") return setStep("intro");
    if (step === "q2") return setStep("q1");
    if (step === "commodities") return setStep("q2");
    if (step === "commodity_q3") {
      if (commodityIndex === 0) return setStep("commodities");
      setCommodityIndex((prev) => prev - 1);
      return setStep("commodity_q5");
    }
    if (step === "commodity_q4") return setStep("commodity_q3");
    if (step === "commodity_q5") return setStep("commodity_q4");
    if (step === "q6") return setStep("commodity_q5");
    if (step === "not_sure_helper") return setStep("q6");
    if (step === "result") {
      if (q6) return setStep(q6 === "not_sure" ? "not_sure_helper" : "q6");
      return setStep("q1");
    }
  };

  const renderOutcomeDetails = () => {
    if (!finalOutcome) return null;
    const isCovered = finalOutcome.type === "covered";
    return (
      <Card className="border-muted/60">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">{OUTCOME_LABELS[finalOutcome.type]}</CardTitle>
            {provisional && finalOutcome.type === "covered" && (
              <Badge variant="secondary">Provisional</Badge>
            )}
          </div>
          <CardDescription>{finalOutcome.reason}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {finalOutcome.type === "eligible_exemption_processing" && (
            <div className="space-y-2">
              <p className="font-semibold">Required documentation checklist (112.2(b)(2)–(b)(6))</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Statements in documents accompanying produce</li>
                <li>Written assurances from the processor</li>
                <li>Documentation/records maintained by the farm</li>
              </ul>
            </div>
          )}

          {finalOutcome.type === "qualified_exemption" && (
            <div className="space-y-2">
              <p className="font-semibold">Qualified exemption reminders</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Modified requirements apply (see 112.6 and 112.7)</li>
                <li>Maintain required documentation/records</li>
              </ul>
              <div className="rounded-lg border border-muted/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                Qualified end-user = consumer of the food, OR a restaurant or retail food establishment located in the
                same State (or same Indian reservation) as the farm, OR within 275 miles of the farm. “Consumer” does
                not include a business.
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="font-semibold">What to do next</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Review the FDA Produce Safety Rule and your state produce safety program guidance.</li>
              <li>Keep documentation that supports your sales and distribution calculations.</li>
              <li>Re-check coverage if your products, sales, or buyers change.</li>
            </ul>
          </div>

          <Alert className="border-amber-200 bg-amber-50/70">
            <AlertTitle>Disclaimer</AlertTitle>
            <AlertDescription>
              Educational tool; not legal advice; confirm with FDA guidance or your state produce safety program.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  };

  const summaryCard = () => (
    <Card className="border-dashed bg-muted/20">
      <CardHeader>
        <CardTitle className="text-lg">Printable summary</CardTitle>
        <CardDescription>Inputs and outcomes for your records.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div>
          <span className="font-semibold text-foreground">Q1:</span> {q1 === "yes" ? "Yes" : "No"}
        </div>
        <div>
          <span className="font-semibold text-foreground">Q2:</span> {q2 === "yes" ? "Yes" : q2 === "no" ? "No" : "—"}
        </div>
        <div className="space-y-2">
          <span className="font-semibold text-foreground">Commodities:</span>
          {commodityOutcomes.map((commodity) => (
            <div key={commodity.id} className="rounded-lg border border-muted/60 bg-white/60 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{commodity.name}</Badge>
                {commodity.outcome && <Badge>{OUTCOME_LABELS[commodity.outcome]}</Badge>}
              </div>
              <div className="mt-2 text-xs">
                Rarely consumed raw: {commodity.rarelyConsumedRaw ?? "—"} | Personal/on-farm:{" "}
                {commodity.personalUse ?? "—"} | Commercial processing kill step:{" "}
                {commodity.processingKillStep ?? "—"}
              </div>
            </div>
          ))}
        </div>
        <div>
          <span className="font-semibold text-foreground">Qualified exemption test:</span>{" "}
          {q6 ? (q6 === "not_sure" ? "Not sure" : q6 === "yes" ? "Yes" : "No") : "—"}
          {q6 === "not_sure" && provisional && <span className="ml-2 text-amber-600">(provisional)</span>}
        </div>
        {finalOutcome && (
          <div>
            <span className="font-semibold text-foreground">Outcome:</span> {OUTCOME_LABELS[finalOutcome.type]}
          </div>
        )}
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print summary
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <LayoutShell>
      <div className="max-w-3xl mx-auto py-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            FSMA Produce Safety Rule Coverage Checker (21 CFR Part 112)
          </h1>
          <p className="text-muted-foreground">
            Anonymous mode by default. No account or farm details required.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardDescription className="uppercase tracking-wider text-xs font-bold text-primary">
              Step {["intro", "q1", "q2", "commodities", "commodity_q3", "commodity_q4", "commodity_q5", "q6", "not_sure_helper", "result"].indexOf(step) + 1} of 10
            </CardDescription>
            <CardTitle className="text-2xl">
              {step === "intro" && "Start the coverage check"}
              {step === "q1" && "Q1. Does your farm grow, harvest, pack, or hold produce?"}
              {step === "q2" && "Q2. Does your farm have $25,000 or less in annual produce sales (3-year average)?"}
              {step === "commodities" && "Which produce commodities do you grow/handle?"}
              {step === "commodity_q3" && `Q3. Is ${activeCommodity?.name} rarely consumed raw?`}
              {step === "commodity_q4" && `Q4. Is ${activeCommodity?.name} for personal/on-farm consumption?`}
              {step === "commodity_q5" && `Q5. Is ${activeCommodity?.name} for commercial processing with a kill step?`}
              {step === "q6" &&
                "Q6. Qualified exemption check (3-year average food sales and direct-to-end-user majority)"}
              {step === "not_sure_helper" && "Not sure? Here is what you need to confirm"}
              {step === "result" && "Result"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "intro" && (
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  This tool follows the FDA flowchart logic for FSMA Produce Safety Rule coverage. Answer one question
                  at a time.
                </p>
                <p>
                  “Produce,” “annual produce sales,” and “annual food sales” are defined in the regulation. Use gross
                  sales averages over the previous 3 years.
                </p>
              </div>
            )}

            {step === "q1" && (
              <RadioGroup value={q1} onValueChange={(value) => setQ1(value as YesNo)} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="q1-yes" />
                  <Label htmlFor="q1-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="q1-no" />
                  <Label htmlFor="q1-no">No</Label>
                </div>
              </RadioGroup>
            )}

            {step === "q2" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Use the previous 3-year average for gross produce sales.
                </p>
                <RadioGroup value={q2} onValueChange={(value) => setQ2(value as YesNo)} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="q2-yes" />
                    <Label htmlFor="q2-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="q2-no" />
                    <Label htmlFor="q2-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === "commodities" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add each produce commodity you grow, harvest, pack, or hold. You will answer commodity questions one
                  at a time.
                </p>
                <div className="space-y-3">
                  {commodities.map((commodity, index) => (
                    <div key={commodity.id} className="flex items-center gap-2">
                      <Input
                        value={commodity.name}
                        onChange={(event) =>
                          setCommodities((prev) =>
                            prev.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, name: event.target.value } : item
                            )
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCommodities((prev) => [...prev, createCommodity("New produce item")])}
                >
                  Add another commodity
                </Button>
              </div>
            )}

            {step === "commodity_q3" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  FDA identifies certain commodities as “rarely consumed raw.”
                </p>
                <RadioGroup
                  value={activeCommodity?.rarelyConsumedRaw ?? ""}
                  onValueChange={(value) => updateCommodity({ rarelyConsumedRaw: value as YesNo })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="q3-yes" />
                    <Label htmlFor="q3-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="q3-no" />
                    <Label htmlFor="q3-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === "commodity_q4" && (
              <div className="space-y-3">
                <RadioGroup
                  value={activeCommodity?.personalUse ?? ""}
                  onValueChange={(value) => updateCommodity({ personalUse: value as YesNo })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="q4-yes" />
                    <Label htmlFor="q4-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="q4-no" />
                    <Label htmlFor="q4-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === "commodity_q5" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Examples of “kill step” processing include cooking, pasteurization, or other validated pathogen
                  reduction steps.
                </p>
                <RadioGroup
                  value={activeCommodity?.processingKillStep ?? ""}
                  onValueChange={(value) => updateCommodity({ processingKillStep: value as YesNo })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="q5-yes" />
                    <Label htmlFor="q5-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="q5-no" />
                    <Label htmlFor="q5-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === "q6" && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Use 3-year averages for gross annual food sales and check whether most sales are directly to qualified
                  end-users.
                </p>
                <RadioGroup value={q6} onValueChange={(value) => setQ6(value as YesNoMaybe)} className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="q6-yes" />
                    <Label htmlFor="q6-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="q6-no" />
                    <Label htmlFor="q6-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not_sure" id="q6-not-sure" />
                    <Label htmlFor="q6-not-sure">Not sure</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {step === "not_sure_helper" && (
              <div className="space-y-4 text-sm text-muted-foreground">
                <p>
                  To answer the qualified exemption test, you’ll need:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>3-year average of annual food sales (gross).</li>
                  <li>Total food sales vs. direct-to-qualified-end-user sales.</li>
                  <li>Proof of the majority test (by value).</li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => setStep("q6")}>
                    Go back and answer
                  </Button>
                  <Button
                    onClick={() => {
                      setProvisional(true);
                      setStep("result");
                    }}
                  >
                    Continue anyway
                  </Button>
                </div>
              </div>
            )}

            {step === "result" && (
              <div className="space-y-6">
                {finalOutcome ? renderOutcomeDetails() : (
                  <Alert className="border-amber-200 bg-amber-50/70">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle>Result incomplete</AlertTitle>
                    <AlertDescription>Please complete the wizard to view results.</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Commodity results</h3>
                  <div className="grid gap-3">
                    {commodityOutcomes.map((commodity) => (
                      <Card key={commodity.id} className="border-muted/60">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{commodity.name}</CardTitle>
                          {commodity.outcome && (
                            <CardDescription>{OUTCOME_LABELS[commodity.outcome]}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                          {commodity.outcomeReason ?? "No exclusion or exemption identified for this commodity."}
                          {commodity.outcome === "eligible_exemption_processing" && (
                            <div className="mt-3 space-y-1">
                              <p className="font-semibold text-foreground">Documentation checklist</p>
                              <ul className="list-disc pl-5 space-y-1">
                                <li>Statements in documents accompanying produce</li>
                                <li>Written assurances</li>
                                <li>Documentation/records</li>
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {summaryCard()}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-wrap justify-between gap-3">
            <div className="flex gap-2">
              {step !== "intro" && (
                <Button variant="ghost" onClick={back}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button variant="outline" onClick={resetAll}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Start over
              </Button>
            </div>
            {step !== "result" && step !== "not_sure_helper" && (
              <Button onClick={next} disabled={
                (step === "q1" && !q1) ||
                (step === "q2" && !q2) ||
                (step === "commodity_q3" && !activeCommodity?.rarelyConsumedRaw) ||
                (step === "commodity_q4" && !activeCommodity?.personalUse) ||
                (step === "commodity_q5" && !activeCommodity?.processingKillStep) ||
                (step === "q6" && !q6)
              }>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === "not_sure_helper" && (
              <Button onClick={next}>
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {step === "result" && (
              <Button onClick={resetAll}>
                Start over
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </LayoutShell>
  );
}
