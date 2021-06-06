import { useMemo } from "react";
import { useHistory } from "react-router-dom";

// This component is a button that enables react-routing
const LinkButton = (props) => {
  const router = useRouter();
  const label = props.useSpan ? <span>{props.label}</span> : props.label;
  return (
    <button
      type="button"
      className={props.className}
      style={props.style}
      onClick={(e) => {
        router.push(props.pathname);
        if ("onClick" in props) props.onClick();
      }}
    >
      {label}
    </button>
  );
};

const useRouter = () => {
  const history = useHistory();
  return useMemo(
    () => ({
      push: history.push,
      history,
    }),
    [history]
  );
};

// A dark overlay that covers the entire screen when certain components need to be emphasized
const ShadowScreen = () => <div className="shadow-screen" />;

// A component that allows users to confirm or cancel an action
const ConfirmCancelAction = (props) => {
  return (
    <>
      <ShadowScreen />
      <div className="high-zindex-centered-container">
        <div className="container">
          <h2>{props.header}</h2>
          <p>{props.text}</p>
          <div className="buttons-sideBySide">
            <button
              type="button"
              className="blue-button"
              style={{ marginRight: 20 }}
              onClick={() => {
                props.confirmFunc();
              }}
            >
              Confirm
            </button>
            <button
              type="button"
              className="red-button"
              style={{ marginLeft: 20 }}
              onClick={() => {
                props.cancelFunc();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export { LinkButton, ShadowScreen, ConfirmCancelAction };
