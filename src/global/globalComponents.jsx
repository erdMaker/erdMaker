import React, { useMemo } from "react";
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
const ShadowOverlay = () => <div className="shadow-overlay" />;

export { LinkButton, ShadowOverlay };
