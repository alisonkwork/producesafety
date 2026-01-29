
type HelperAction = {
  id: string;
  label: string;
  onClick: () => void;
};

type HelperSlideProps = {
  title: string;
  body: string[];
  actions: HelperAction[];
};

const HelperSlide = ({ title, body, actions }: HelperSlideProps) => {
  return (
    <div className="slide-content">
      <div className="slide-title">{title}</div>
      <div className="prompt-block">
        {body.map((line, index) => (
          <p key={`${line}-${index}`} className="prompt">
            {line}
          </p>
        ))}
      </div>
      <div className="helper-actions">
        {actions.map((action) => (
          <button key={action.id} className="option" onClick={action.onClick}>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HelperSlide;
