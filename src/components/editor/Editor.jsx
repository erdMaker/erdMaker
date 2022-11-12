import { useState, useEffect } from "react";
import Surface from "./Surface";
import Tools from "./Tools";
import { getDiagram, makeCompatible } from "../../global/globalFuncs";
import { connect } from "react-redux";
import {
  deselect,
  updateSidepanelWidth,
  resetComponents,
  resetMeta,
  setDiagramFetched,
  setMeta,
  setComponents,
} from "../../actions/actions";
import axios from "axios";
import { diagramLimit } from "../../global/constants.js";
import { store } from "../../index.js";

// By having this function make the loaded diagram compatible,
// the editor doesnt depend on global state components and, thus,
// we avoid unnecessary rerenders.
function makeLoadedDiagramCompatible() {
  const state = store.getState();
  const storedDiagram = { meta: state.meta, components: state.components };
  return makeCompatible(storedDiagram);
}

const Editor = (props) => {
  const [showSaveWarning, setShowSaveWarning] = useState(true);

  useEffect(() => {
    const clearEditor = () => {
      props.deselect();
      if (props.general.activeDiagramId) {
        props.resetComponents();
        props.resetMeta();
        // We do not clear activeDiagramId so that the user can resume to their most recent diagram
        // after they leave the page and press Back to return
      }
    };

    props.updateSidepanelWidth();
    const cancelToken = axios.CancelToken.source();
    const compatibleDiagram = makeLoadedDiagramCompatible();
    props.deselect();
    props.setMeta(compatibleDiagram.meta);
    props.setComponents(compatibleDiagram.components);

    document.title = "ERD Maker - Editor";
    window.addEventListener("resize", props.updateSidepanelWidth);
    window.addEventListener("beforeunload", clearEditor);
    if (props.user.isLogged) {
      if (props.general.activeDiagramId) getDiagram(props.general.activeDiagramId, cancelToken);
      // Fetch the diagram
      else props.setDiagramFetched({ fetched: true }); // No diagram to fetch so set it to true anyway so the saving process can proceed
    }

    return () => {
      clearEditor();
      cancelToken.cancel("Request is being canceled");
      props.setDiagramFetched({ fetched: false });
      window.removeEventListener("resize", props.updateSidepanelWidth);
      window.removeEventListener("beforeunload", clearEditor);
    };
    // eslint-disable-next-line
  }, [props.general.activeDiagramId]);

  const saveEnabled =
    props.user.confirmed && (props.user.diagramsOwned < diagramLimit || props.general.activeDiagramId) ? true : false;

  return (
    <div className="editor" onClick={() => setShowSaveWarning(false)}>
      <Tools saveEnabled={saveEnabled} />
      {saveEnabled && (
        <div className="save-warning" style={{ visibility: showSaveWarning ? "visible" : "hidden" }}>
          Please make sure you manually save your progress by clicking the 'Save' button before exiting the editor.
        </div>
      )}
      <Surface />
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  general: state.general,
});

const mapDispatchToProps = {
  deselect,
  updateSidepanelWidth,
  resetComponents,
  resetMeta,
  setDiagramFetched,
  setMeta,
  setComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
