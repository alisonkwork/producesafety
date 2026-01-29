import { ResultDefinition } from "../engine/flowEngine";

type ResultSlideProps = {
  outcome: ResultDefinition;
  answers: Array<{ label: string; value: string }>;
  flags: Record<string, boolean>;
  reasons: string[];
  onPrint: () => void;
  onRestart: () => void;
};

const ResultSlide = ({ outcome, answers, flags, reasons, onPrint, onRestart }: ResultSlideProps) => {
  return (
    <div className="slide-content result">
      <div className={`result-banner result-banner--${outcome.tone ?? "neutral"}`}>
        <div className="result-label">{outcome.label}</div>
        <p className="result-summary">{outcome.summary}</p>
        {flags.provisional && <span className="result-flag">Provisional</span>}
      </div>

      <div className="result-section">
        <h3>Why you got this result</h3>
        <ul>
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>

      {outcome.reminderItems && outcome.reminderItems.length > 0 && (
        <div className="result-section callout">
          <h3>{outcome.reminderTitle ?? "Reminder"}</h3>
          <ul>
            {outcome.reminderItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="result-section">
        <h3>Your answers</h3>
        <div className="answer-grid">
          {answers.map((answer) => (
            <div key={answer.label} className="answer-row">
              <div className="answer-label">{answer.label}</div>
              <div className="answer-value">{answer.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="result-actions">
        <button className="btn btn-primary" onClick={onPrint}>
          Print / Save PDF
        </button>
        <button className="btn btn-secondary" onClick={onRestart}>
          Start over
        </button>
      </div>

      <div id="print-summary" className="print-summary">
        <h1>FSMA Produce Safety Rule Coverage Checker</h1>
        <h2>{outcome.label}</h2>
        <p>{outcome.summary}</p>
        {flags.provisional && <p>Provisional result based on a \"not sure\" response.</p>}
        <h3>Why you got this result</h3>
        <ul>
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        {outcome.reminderItems && outcome.reminderItems.length > 0 && (
          <>
            <h3>{outcome.reminderTitle ?? "Reminder"}</h3>
            <ul>
              {outcome.reminderItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        )}
        <h3>Your answers</h3>
        <ul>
          {answers.map((answer) => (
            <li key={answer.label}>
              <strong>{answer.label}</strong> {answer.value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResultSlide;
