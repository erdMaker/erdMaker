import { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  addEntity,
  addRelationship,
  addLabel,
  setTitle,
  setActiveDiagram,
  resetComponents,
  select,
  deselect,
  resetMeta,
} from "../../actions/actions";
import { Link } from "react-router-dom";
import Logo from "../../img/logo.png";
import { savediagram } from "../../global/diagramRequests";
import ImportExportMenuListComposition from "./ImportExportMenu";
import saveImg from "../../img/saveIcon.png";
import axios from "axios";
import { diagramLimit, savePeriod } from "../../global/constants.js";

const Tools = (props) => {
  const saveIconColors = {
    red: "#b30d23",
    blue: "#0086a8",
    green: "#00b53c",
  };
  const cancelToken = axios.CancelToken.source();

  const [saveStatus, setSaveStatus] = useState({ text: "Your progress is being saved.", color: saveIconColors.green });
  const [lastSave, setLastSave] = useState(" ");
  const [clearButtonText, setClearButtonText] = useState("Clear Diagram");
  const [toolsListActive, setToolsListActive] = useState(false);

  useEffect(() => {
    let saveTimer;
    if (props.saveEnabled && props.general.diagramFetched) saveTimer = setInterval(() => saveDiagram(), savePeriod);

    return () => {
      clearInterval(saveTimer);
      clearTimeout(clickTimer.current);
      cancelToken.cancel("Request is being canceled");
    };
    // eslint-disable-next-line
  }, [props.general.diagramFetched, props.general.activeDiagramId]);

  const saveDiagram = async () => {
    if (!props.general.diagramFetched) {
      return;
    }

    setSaveStatus({ ...saveStatus, text: "Saving...", color: saveIconColors.blue });
    try {
      const res = await savediagram(props.general.activeDiagramId, cancelToken);
      if (res && (res.status === 200 || res.status === 201)) {
        if (!props.general.activeDiagramId) props.setActiveDiagram(res.data.id);
        const saveTime = new Date();
        const hours = saveTime.getHours();
        const minutes = saveTime.getMinutes();
        const seconds = saveTime.getSeconds();
        setSaveStatus({ ...saveStatus, text: "Your progress is being saved.", color: saveIconColors.green });
        setLastSave("Last Save " + hours + ":" + minutes + ":" + seconds);
      } else {
        setSaveStatus({
          ...saveStatus,
          text: "Not able to save. Leaving or refreshing the page might log you out.",
          color: saveIconColors.red,
        });
      }
    } catch (e) {}
  };

  const clearStage = () => {
    props.deselect();
    props.resetMeta();
    props.resetComponents();
  };

  let clickTimer = useRef(null);

  // Functions that handle the hold-click on "Clear Diagram" button
  const start = () => {
    clickTimer.current = setTimeout(() => timerReached(), 3000);
    setClearButtonText("Hold to clear");
  };

  const end = () => {
    clearTimeout(clickTimer.current);
    setClearButtonText("Clear Diagram");
  };

  const timerReached = () => {
    clearStage();
    end();
  };

  const saveIconGroup = props.saveEnabled ? (
    <SaveIconGroup saveStatus={saveStatus} lastSave={lastSave} savefunc={() => saveDiagram()} />
  ) : null;

  const saveButton = props.saveEnabled ? (
    <button className="tools-button-blue" type="button" disabled={!props.general.diagramFetched} onClick={saveDiagram}>
      Save
    </button>
  ) : null;

  const titleInput = (
    <input
      className="big-editor-input"
      type="text"
      name="title"
      id="title"
      maxLength="17"
      value={props.meta.title}
      onChange={(e) =>
        props.setTitle({
          title: e.target.value,
        })
      }
    />
  );
  const clearStageButton =
    (!props.user.confirmed || props.user.diagramsOwned >= diagramLimit) && !props.general.activeDiagramId ? (
      <button
        type="button"
        className="tools-button-red"
        onTouchStart={start}
        onTouchEnd={end}
        onTouchCancel={end}
        onMouseDown={start}
        onMouseUp={end}
        onMouseOut={() => {
          if (clickTimer.current) end();
        }}
      >
        {clearButtonText}
      </button>
    ) : null;

  // CSS classes are set for the burger menu (whether its displayed or not)
  let toolsClasses = "tools__list";
  let line1Class = "";
  let line2Class = "";
  let line3Class = "";

  if (toolsListActive) {
    toolsClasses += " tools__list-active";
    line1Class = "line1";
    line2Class = "line2";
    line3Class = "line3";
  }

  return (
    <div className="tool-bar">
      <Link to="/">
        <img src={Logo} className="logo" alt=":(" />
      </Link>
      {saveIconGroup}
      <ul className={toolsClasses}>
        {saveButton}
        <ImportExportMenuListComposition />
        {titleInput}
        <button
          className="tools-button-blue"
          type="button"
          onClick={() => {
            props.addEntity();
            props.select({
              type: "entity",
              id: props.components.count + 1,
              parentId: null,
            });
            setToolsListActive(!toolsListActive);
          }}
        >
          New Entity
        </button>
        <button
          className="tools-button-blue"
          type="button"
          onClick={() => {
            props.addRelationship();
            props.select({
              type: "relationship",
              id: props.components.count + 1,
              parentId: null,
            });
            setToolsListActive(!toolsListActive);
          }}
        >
          New Relationship
        </button>
        <button
          className="tools-button-blue"
          type="button"
          onClick={() => {
            props.addLabel();
            props.select({
              type: "label",
              id: props.components.count + 1,
              parentId: null,
            });
            setToolsListActive(!toolsListActive);
          }}
        >
          New Label
        </button>
        {clearStageButton}
      </ul>
      <div
        className="burger"
        onClick={() => {
          setToolsListActive(!toolsListActive);
        }}
      >
        <div className={line1Class} />
        <div className={line2Class} />
        <div className={line3Class} />
      </div>
    </div>
  );
};

const SaveIconGroup = (props) => (
  <div className="save-icon-group" style={{ backgroundColor: props.saveStatus.color }}>
    <img src={saveImg} alt=":(" />
    <span className="save-icon-tooltip">
      {props.saveStatus.text}
      <br />
      {props.lastSave}
    </span>
  </div>
);

const mapStateToProps = (state) => ({
  user: state.user,
  meta: state.meta,
  components: state.components,
  general: state.general,
});

const mapDispatchToProps = {
  addEntity,
  addRelationship,
  addLabel,
  setTitle,
  setActiveDiagram,
  resetComponents,
  select,
  deselect,
  resetMeta,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tools);
