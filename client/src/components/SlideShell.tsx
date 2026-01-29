import { ReactNode, useEffect, useMemo, useState } from "react";
import { FlowNode } from "../engine/flowEngine";

type SlideShellProps = {
  node?: FlowNode;
  step: number | null;
  totalSteps: number | null;
  onBack: () => void;
  canGoBack: boolean;
  onRestart: () => void;
  direction: "forward" | "back";
  primaryAction?: ReactNode;
  children: ReactNode;
};

const SlideShell = ({
  node,
  step,
  totalSteps,
  onBack,
  canGoBack,
  onRestart,
  direction,
  primaryAction,
  children,
}: SlideShellProps) => {
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 768px)");
    if (media.matches) {
      setShowFullscreenPrompt(true);
    }
  }, []);

  const handleFullscreen = () => {
    setShowFullscreenPrompt(false);
    if (document.fullscreenEnabled && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => undefined);
    }
  };

  const showRestart = node?.type !== "intro";
  const showBack = canGoBack && node?.type !== "intro";

  const slideKey = useMemo(() => `${node?.id ?? "slide"}-${direction}`, [node?.id, direction]);

  return (
    <div className="player">
      <div className="stage">
        <div className="stage-header">
          <div className="brand">Am I Covered?</div>
          {step && totalSteps && (
            <div className="progress">Step {step} of {totalSteps}</div>
          )}
        </div>
        <div key={slideKey} className={`slide slide--${direction}`}>
          {children}
        </div>
        <div className="stage-footer">
          <div className="footer-left">
            {showBack && (
              <button className="btn btn-secondary" onClick={onBack}>
                Back
              </button>
            )}
          </div>
          <div className="footer-center">
            {showRestart && (
              <button className="btn btn-ghost" onClick={onRestart}>
                Start over
              </button>
            )}
          </div>
          <div className="footer-right">{primaryAction}</div>
        </div>
      </div>
      {showFullscreenPrompt && (
        <button className="fullscreen-prompt" onClick={handleFullscreen}>
          Drag up for fullscreen
        </button>
      )}
    </div>
  );
};

export default SlideShell;
