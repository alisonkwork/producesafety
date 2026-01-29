import { useMemo, useState } from "react";
import flowData from "./flow/fsma_coverage_flow.json";
import {
  FlowDefinition,
  FlowStateSnapshot,
  getNodeById,
  getQuestionAnswerLabel,
  getResultReasons,
} from "./engine/flowEngine";
import SlideShell from "./components/SlideShell";
import QuestionSlide from "./components/QuestionSlide";
import HelperSlide from "./components/HelperSlide";
import ResultSlide from "./components/ResultSlide";
import { printSummary } from "./utils/printSummary";

const flow = flowData as FlowDefinition;

type NavDirection = "forward" | "back";

type FlowState = {
  currentNodeId: string;
  answers: Record<string, string>;
  flags: Record<string, boolean>;
};

const initialState: FlowState = {
  currentNodeId: flow.start,
  answers: {},
  flags: {},
};

function App() {
  const [state, setState] = useState<FlowState>(initialState);
  const [history, setHistory] = useState<FlowStateSnapshot[]>([]);
  const [direction, setDirection] = useState<NavDirection>("forward");

  const currentNode = getNodeById(flow, state.currentNodeId);

  const onAdvance = (
    nextId: string,
    payload?: { answers?: Record<string, string>; flags?: Record<string, boolean> },
  ) => {
    setHistory((prev) => [...prev, { ...state }]);
    setDirection("forward");
    setState((prev) => ({
      currentNodeId: nextId,
      answers: { ...prev.answers, ...(payload?.answers ?? {}) },
      flags: { ...prev.flags, ...(payload?.flags ?? {}) },
    }));
  };

  const onBack = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      const last = next.pop();
      if (last) {
        setDirection("back");
        setState(last);
      }
      return next;
    });
  };

  const onRestart = () => {
    setHistory([]);
    setDirection("forward");
    setState(initialState);
  };

  const currentStep = useMemo(() => {
    if (currentNode?.type === "question") return currentNode.step ?? null;
    if (currentNode?.type === "helper") return currentNode.step ?? null;
    return null;
  }, [currentNode]);

  const totalSteps = flow.totalSteps ?? null;

  const summaryItems = useMemo(() => {
    const items: { label: string; value: string }[] = [];
    flow.summaryOrder.forEach((questionId) => {
      const answerValue = state.answers[questionId];
      if (!answerValue) return;
      const questionNode = getNodeById(flow, questionId);
      if (questionNode?.type !== "question") return;
      items.push({
        label: questionNode.prompt,
        value: getQuestionAnswerLabel(questionNode, answerValue) ?? answerValue,
      });
    });
    return items;
  }, [state.answers]);

  const reasonLines = useMemo(() => {
    if (currentNode?.type !== "result") return [];
    return getResultReasons(currentNode.resultKey, state.answers, state.flags);
  }, [currentNode, state.answers, state.flags]);

  const primaryAction = useMemo(() => {
    if (currentNode?.type !== "question") return null;
    const selectedAnswer = state.answers[currentNode.id];
    const nextId = currentNode.options.find((option) => option.value === selectedAnswer)?.next;
    return (
      <button
        className="btn btn-primary"
        onClick={() => nextId && onAdvance(nextId)}
        disabled={!nextId}
      >
        Next
      </button>
    );
  }, [currentNode, state.answers]);

  return (
    <div className="app">
      <SlideShell
        node={currentNode}
        step={currentStep}
        totalSteps={totalSteps}
        onBack={onBack}
        canGoBack={history.length > 0}
        onRestart={onRestart}
        direction={direction}
        primaryAction={primaryAction}
      >
        {currentNode?.type === "intro" && (
          <QuestionSlide
            title={currentNode.title}
            prompt={currentNode.body}
            options={currentNode.actions.map((action) => ({
              id: action.id,
              label: action.label,
              onSelect: () => onAdvance(action.next),
            }))}
            selectedOptionId={null}
            isIntro
          />
        )}

        {currentNode?.type === "question" && (
          <QuestionSlide
            title={currentNode.title}
            prompt={currentNode.prompt}
            helperText={currentNode.helperText}
            options={currentNode.options.map((option) => ({
              id: option.value,
              label: option.label,
              onSelect: () =>
                setState((prev) => ({
                  ...prev,
                  answers: { ...prev.answers, [currentNode.id]: option.value },
                })),
            }))}
            selectedOptionId={state.answers[currentNode.id] ?? null}
          />
        )}

        {currentNode?.type === "helper" && (
          <HelperSlide
            title={currentNode.title}
            body={currentNode.body}
            actions={currentNode.actions.map((action) => ({
              id: action.id,
              label: action.label,
              onClick: () => onAdvance(action.next, { answers: action.setAnswers, flags: action.setFlags }),
            }))}
          />
        )}

        {currentNode?.type === "result" && (
          <ResultSlide
            outcome={flow.results[currentNode.resultKey]}
            answers={summaryItems}
            flags={state.flags}
            reasons={reasonLines}
            onRestart={onRestart}
            onPrint={() => printSummary(flow, currentNode, summaryItems, state.flags)}
          />
        )}
      </SlideShell>
    </div>
  );
}

export default App;
