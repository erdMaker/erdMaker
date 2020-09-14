import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";

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

const ShadowOverlay = () => <div className="shadow-overlay" />;

export { LinkButton, ShadowOverlay };
