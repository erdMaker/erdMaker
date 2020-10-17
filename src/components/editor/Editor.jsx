import React from "react";
import Surface from "./Surface";
import Tools from "./Tools";
import { getDiagram, makeCompatible } from "../../global/globalFuncs";
import { connect } from "react-redux";
import {
  deselect,
  updateSidepanelWidth,
  resetComponents,
  resetMeta,
  setMeta,
  setComponents,
} from "../../actions/actions";
import axios from "axios";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.props.updateSidepanelWidth();
    this.cancelToken = axios.CancelToken.source();
    var storedDiagram = { meta: this.props.meta, components: this.props.components };
    var compatibleDiagram = makeCompatible(storedDiagram);
    this.props.setMeta(compatibleDiagram.meta);
    this.props.setComponents(compatibleDiagram.components);
  }

  componentDidMount = () => {
    document.title = "ERD Maker - Designer";
    window.addEventListener("resize", this.props.updateSidepanelWidth);
    window.addEventListener("beforeunload", this.clearEditor);
    this.props.deselect();
    if (this.props.user.isLogged && this.props.general.activeDiagramId) {
      getDiagram(this.props.general.activeDiagramId, this.cancelToken);
    }
  };

  componentWillUnmount() {
    this.clearEditor();
    this.cancelToken.cancel("Request is being canceled");
    window.removeEventListener("resize", this.props.updateSidepanelWidth);
    window.removeEventListener("beforeunload", this.clearEditor);
  }

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
  meta: state.meta,
  components: state.components,
});

const mapDispatchToProps = {
  deselect,
  updateSidepanelWidth,
  resetComponents,
  resetMeta,
  setMeta,
  setComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
