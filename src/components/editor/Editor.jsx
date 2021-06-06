import { Component } from "react";
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

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSaveWarning: true,
      saveEnabled:
        this.props.user.confirmed &&
        (this.props.user.diagramsOwned < diagramLimit || this.props.general.activeDiagramId)
          ? true
          : false,
    };
    this.props.updateSidepanelWidth();
    this.cancelToken = axios.CancelToken.source();
    var storedDiagram = { meta: this.props.meta, components: this.props.components };
    var compatibleDiagram = makeCompatible(storedDiagram);
    this.props.setMeta(compatibleDiagram.meta);
    this.props.setComponents(compatibleDiagram.components);
  }

  componentDidMount = () => {
    document.title = "ERD Maker - Editor";
    window.addEventListener("resize", this.props.updateSidepanelWidth);
    window.addEventListener("beforeunload", this.clearEditor);
    this.props.deselect();
    if (this.props.user.isLogged) {
      if (this.props.general.activeDiagramId) getDiagram(this.props.general.activeDiagramId, this.cancelToken);
      // Fetch the diagram
      else this.props.setDiagramFetched({ fetched: true }); // No diagram to fetch so set it to true anyway so the saving process can proceed
    }
  };

  componentWillUnmount() {
    this.clearEditor();
    this.cancelToken.cancel("Request is being canceled");
    this.props.setDiagramFetched({ fetched: false });
    window.removeEventListener("resize", this.props.updateSidepanelWidth);
    window.removeEventListener("beforeunload", this.clearEditor);
  }

  clearEditor = () => {
    this.props.deselect();
    if (this.props.general.activeDiagramId) {
      this.props.resetComponents();
      this.props.resetMeta();
      // We do not clear the activeDiagramId so that the user can resume to their most recent diagram
      // after they leave the page and press Back to return
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.showSaveWarning === nextState.showSaveWarning) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div className="editor" onClick={() => this.setState({ showSaveWarning: false })}>
        <Tools saveEnabled={this.state.saveEnabled} />
        {this.state.saveEnabled && (
          <div className="save-warning" style={{ visibility: this.state.showSaveWarning ? "visible" : "hidden" }}>
            Please make sure you manually save your progress by clicking the 'Save' button, before exiting the editor.
          </div>
        )}
        <Surface />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  general: state.general,
  meta: state.meta,
  components: state.components,
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
