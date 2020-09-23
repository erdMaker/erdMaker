import React from "react";
import Surface from "./Surface";
import Tools from "./Tools";
import { getDiagram } from "../../global/globalFuncs";
import { connect } from "react-redux";
import { deselect, 
  //updateScreenSize, 
  updateSidepanelWidth, resetComponents, resetMeta } from "../../actions/actions";
import axios from "axios";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.updateSidepanelSize();
    this.cancelToken = axios.CancelToken.source();
  }

  componentDidMount = () => {
    document.title = "ERD Maker - Designer";
    window.addEventListener("resize", this.updateSidepanelSize);
    window.addEventListener("beforeunload", this.clearEditor);
    this.props.deselect();
    if (this.props.user.isLogged && this.props.general.activeDiagramId) {
      getDiagram(this.props.general.activeDiagramId, this.cancelToken);
    }
  };

  componentWillUnmount() {
    this.clearEditor();
    this.cancelToken.cancel("Request is being canceled");
    window.removeEventListener("resize", this.updateSidepanelSize);
    window.removeEventListener("beforeunload", this.clearEditor);
  }

  updateSidepanelSize = () => {
    console.log("editor resize")
    //this.props.updateScreenSize();
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
  //updateScreenSize,
  updateSidepanelWidth,
  resetComponents,
  resetMeta,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
