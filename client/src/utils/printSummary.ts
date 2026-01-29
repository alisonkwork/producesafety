import { FlowDefinition, ResultNode } from "../engine/flowEngine";

export const printSummary = (
  _flow: FlowDefinition,
  _resultNode: ResultNode,
  _answers: Array<{ label: string; value: string }>,
  _flags: Record<string, boolean>,
) => {
  if (typeof window === "undefined") return;
  window.print();
};
