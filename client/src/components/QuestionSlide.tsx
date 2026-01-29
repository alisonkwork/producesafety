type Option = {
  id: string;
  label: string;
  onSelect: () => void;
};

type QuestionSlideProps = {
  title: string;
  prompt: string | string[];
  helperText?: string;
  options: Option[];
  selectedOptionId: string | null;
  isIntro?: boolean;
};

const QuestionSlide = ({
  title,
  prompt,
  helperText,
  options,
  selectedOptionId,
  isIntro,
}: QuestionSlideProps) => {
  const renderPrompt = () => {
    if (Array.isArray(prompt)) {
      return (
        <div className="prompt-block">
          {prompt.map((line, index) => (
            <p key={`${line}-${index}`} className="prompt">
              {line}
            </p>
          ))}
        </div>
      );
    }
    return <p className="prompt">{prompt}</p>;
  };

  return (
    <div className="slide-content">
      <div className="slide-title">{title}</div>
      {renderPrompt()}
      {helperText && <p className="helper-text">{helperText}</p>}
      <div className={isIntro ? "intro-actions" : "option-list"}>
        {options.map((option) => (
          <button
            key={option.id}
            className={`option ${selectedOptionId === option.id ? "option--selected" : ""}`}
            onClick={option.onSelect}
            aria-pressed={selectedOptionId === option.id}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionSlide;
