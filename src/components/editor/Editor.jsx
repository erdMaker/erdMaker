import React from "react";
import Surface from "./Surface";
import Tools from "./Tools";
import { getDiagram } from "../../global/globalFuncs";
import { connect } from "react-redux";
import { deselect, updateScreenSize, updateSidepanelWidth, resetComponents, resetMeta } from "../../actions/actions";
import axios from "axios";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.updateScreenAndPanelSize();
    this.cancelToken = axios.CancelToken.source();
  }

  componentDidMount = () => {
    document.title = "ERD Maker - Designer";
    window.addEventListener("resize", this.updateScreenAndPanelSize);
    window.addEventListener("beforeunload", this.clearEditor);
    this.props.deselect();
    if (this.props.user.isLogged && this.props.general.activeDiagramId) {
      getDiagram(this.props.general.activeDiagramId, this.cancelToken);
    }
  };

  componentWillUnmount() {
    this.clearEditor();
    this.cancelToken.cancel("Request is being canceled");
    window.removeEventListener("resize", this.updateScreenAndPanelSize);
    window.removeEventListener("beforeunload", this.clearEditor);
  }

  updateScreenAndPanelSize = () => {
    this.props.updateScreenSize();
    this.props.updateSidepanelWidth();
  };

  clearEditor = () => {
    this.props.deselect();
    if (this.props.general.activeDiagramId) {
      this.props.resetComponents();
      this.props.resetMeta();
    }
  };

  render() {
    return (
      <div className="editor">
        <Tools />
        <Surface />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  general: state.general,
});

const mapDispatchToProps = {
  deselect,
  updateScreenSize,
  updateSidepanelWidth,
  resetComponents,
  resetMeta,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
