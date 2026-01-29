export type AnswerMap = Record<string, string>;
export type FlagMap = Record<string, boolean>;

export type FlowDefinition = {
  start: string;
  totalSteps?: number;
  summaryOrder: string[];
  results: Record<string, ResultDefinition>;
  nodes: Record<string, FlowNode>;
};

export type ResultDefinition = {
  label: string;
  summary: string;
  tone?: "neutral" | "informational" | "important";
  reminderTitle?: string;
  reminderItems?: string[];
};

export type FlowNode = IntroNode | QuestionNode | HelperNode | ResultNode;

export type IntroNode = {
  id: string;
  type: "intro";
  title: string;
  body: string[];
  actions: Array<{ id: string; label: string; next: string }>;
};

export type QuestionNode = {
  id: string;
  type: "question";
  step?: number;
  title: string;
  prompt: string;
  helperText?: string;
  options: Array<{ label: string; value: string; next: string }>;
};

export type HelperNode = {
  id: string;
  type: "helper";
  step?: number;
  title: string;
  body: string[];
  actions: Array<{
    id: string;
    label: string;
    next: string;
    setAnswers?: AnswerMap;
    setFlags?: FlagMap;
  }>;
};

export type ResultNode = {
  id: string;
  type: "result";
  resultKey: string;
};

export type FlowStateSnapshot = {
  currentNodeId: string;
  answers: AnswerMap;
  flags: FlagMap;
};

export const getNodeById = (flow: FlowDefinition, id: string): FlowNode | undefined => flow.nodes[id];

export const getQuestionAnswerLabel = (node: QuestionNode, value: string): string | undefined => {
  return node.options.find((option) => option.value === value)?.label;
};

export const getResultReasons = (
  resultKey: string,
  answers: AnswerMap,
  flags: FlagMap,
): string[] => {
  switch (resultKey) {
    case "not_covered": {
      if (answers.q1 === "no") {
        return ["You indicated the farm does not grow, harvest, pack, or hold produce."];
      }
      if (answers.q2 === "yes") {
        return ["You indicated average annual produce sales are $25,000 or less (3-year average)."];
      }
      return ["Your answers indicate the Produce Safety Rule does not apply."];
    }
    case "rarely_consumed_raw":
      return ["You indicated the commodity is rarely consumed raw."];
    case "personal_consumption":
      return ["You indicated the produce is for personal or on-farm consumption."];
    case "processing_exemption":
      return ["You indicated the produce is intended for commercial processing with an adequate kill step."];
    case "qualified_exemption":
      return [
        "You indicated annual food sales are less than $500,000 and a majority of sales go to qualified end users.",
      ];
    case "covered":
      if (flags.provisional) {
        return [
          "You selected a provisional result because you were not sure about the qualified exemption test.",
          "Confirm your sales and buyer details to determine whether a qualified exemption applies.",
        ];
      }
      return [
        "You indicated the farm does not meet the qualified exemption test based on your sales and buyers.",
      ];
    default:
      return ["Review your answers to confirm this result."];
  }
};
