import { Component } from "react";
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

class Tools extends Component {
  saveIconColors = {
    red: "#b30d23",
    blue: "#0086a8",
    green: "#00b53c",
  };
  state = {
    saveStatus: { text: "Your progress is being saved.", color: this.saveIconColors.green },
    lastSave: " ",
    clearButtonText: "Clear Diagram",
    toolsListActive: false,
  };
  cancelToken = axios.CancelToken.source();

  componentDidMount() {
    window.addEventListener("beforeunload", this.timerCleanup);
    if (this.props.saveEnabled) this.saveTimer = setInterval(() => this.saveDiagram(), savePeriod);
  }

  componentWillUnmount() {
    this.timerCleanup();
    this.cancelToken.cancel("Request is being canceled");
    window.removeEventListener("beforeunload", this.timerCleanup);
  }

  timerCleanup() {
    clearInterval(this.saveTimer);
    clearTimeout(this.clickTimer);
  }

  saveDiagram = () => {
    if (!this.props.general.diagramFetched) return;
    this.setState({ saveStatus: { text: "Saving...", color: this.saveIconColors.blue } });
    savediagram(this.cancelToken)
      .then((res) => {
        if (res && (res.status === 200 || res.status === 201)) {
          if (!this.props.general.activeDiagramId) this.props.setActiveDiagram(res.data.id);
          var saveTime = new Date();
          var hours = saveTime.getHours();
          var minutes = saveTime.getMinutes();
          var seconds = saveTime.getSeconds();
          this.setState({
            saveStatus: {
              text: "Your progress is being saved.",
              color: this.saveIconColors.green,
            },
            lastSave: "Last Save " + hours + ":" + minutes + ":" + seconds,
          });
        } else {
          this.setState({
            saveStatus: {
              text: "Not able to save. Leaving or refreshing the page might log you out.",
              color: this.saveIconColors.red,
            },
          });
        }
      })
      .catch(() => {});
  };

  clearStage = () => {
    this.props.deselect();
    this.props.resetMeta();
    this.props.resetComponents();
  };

  // Functions that handle the hold-click on "Clear Diagram" button
  start = () => {
    this.clickTimer = setTimeout(() => this.timerReached(), 3000);
    this.setState({
      clearButtonText: "Hold to clear",
    });
  };

  end = () => {
    clearTimeout(this.clickTimer);
    this.setState({ clearButtonText: "Clear Diagram" });
  };

  timerReached = () => {
    this.clearStage();
    this.end();
  };

  render() {
    var saveIconGroup = this.props.saveEnabled ? (
      <SaveIconGroup
        saveStatus={this.state.saveStatus}
        lastSave={this.state.lastSave}
        savefunc={() => this.saveDiagram()}
      />
    ) : null;

    var saveButton = this.props.saveEnabled ? (
      <button
        className="tools-button-blue"
        type="button"
        disabled={!this.props.general.diagramFetched}
        onClick={this.saveDiagram}
      >
        Save
      </button>
    ) : null;

    var titleInput = (
      <input
        className="big-editor-input"
        type="text"
        name="title"
        id="title"
        maxLength="17"
        value={this.props.meta.title}
        onChange={(e) =>
          this.props.setTitle({
            title: e.target.value,
          })
        }
      />
    );
    var clearStageButton =
      (!this.props.user.confirmed || this.props.user.diagramsOwned >= diagramLimit) &&
      !this.props.general.activeDiagramId ? (
        <button
          type="button"
          className="tools-button-red"
          onTouchStart={this.start}
          onTouchEnd={this.end}
          onTouchCancel={this.end}
          onMouseDown={this.start}
          onMouseUp={this.end}
          onMouseOut={this.end}
        >
          {this.state.clearButtonText}
        </button>
      ) : null;

    // CSS classes are set for the burger menu (whether its displayed or not)
    var toolsClasses = "tools__list";
    var line1Class = "";
    var line2Class = "";
    var line3Class = "";

    if (this.state.toolsListActive) {
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
              this.props.addEntity();
              this.props.select({
                type: "entity",
                id: this.props.components.count + 1,
                parentId: null,
              });
              this.setState({ toolsListActive: !this.state.toolsListActive });
            }}
          >
            New Entity
          </button>
          <button
            className="tools-button-blue"
            type="button"
            onClick={() => {
              this.props.addRelationship();
              this.props.select({
                type: "relationship",
                id: this.props.components.count + 1,
                parentId: null,
              });
              this.setState({ toolsListActive: !this.state.toolsListActive });
            }}
          >
            New Relationship
          </button>
          <button
            className="tools-button-blue"
            type="button"
            onClick={() => {
              this.props.addLabel();
              this.props.select({
                type: "label",
                id: this.props.components.count + 1,
                parentId: null,
              });
              this.setState({ toolsListActive: !this.state.toolsListActive });
            }}
          >
            New Label
          </button>
          {clearStageButton}
        </ul>
        <div
          className="burger"
          onClick={() => {
            this.setState({ toolsListActive: !this.state.toolsListActive });
          }}
        >
          <div className={line1Class} />
          <div className={line2Class} />
          <div className={line3Class} />
        </div>
      </div>
    );
  }
}

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
