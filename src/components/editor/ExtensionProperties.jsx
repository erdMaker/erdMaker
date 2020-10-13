import React from "react";
import { connect } from "react-redux";
import { modifyExtension, deleteExtension, deselect } from "../../actions/actions";
//import IconButton from "@material-ui/core/IconButton";
//import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
//import ExpandLessIcon from "@material-ui/icons/ExpandLess";
//import DeleteIcon from "@material-ui/icons/Delete";

class ExtensionProperties extends React.Component {
  findExtensionIndex = (extension) => extension.id === this.props.selector.current.id;

  handleModifyExtension = (e) => {
    this.props.modifyExtension({
      id: this.props.selector.current.id,
      prop: e.target.id,
      value: e.target.value,
    });
  };

  render() {
    var extensionIndex = this.props.components.extensions.findIndex(this.findExtensionIndex);
    var content;
    if (this.props.components.extensions[extensionIndex].type === "specialize")
      content = (
        <Specialize
          extension={this.props.components.extensions[extensionIndex]}
          handleModifyExtension={this.handleModifyExtension}
        />
      );
    else if (this.props.components.extensions[extensionIndex].type === "union")
      content = (
        <Union
          extension={this.props.components.extensions[extensionIndex]}
          handleModifyExtension={this.handleModifyExtension}
        />
      );
    else content = null;
    return (
      <div className="sidepanel-content">
        <h3>Extension</h3>
        <table className="type-inputs">
          <tbody>
            <tr>
              <td>Type:</td>
              <td>
                <select
                  id="type"
                  value={this.props.components.extensions[extensionIndex].type}
                  onChange={this.handleModifyExtension}
                >
                  <option value="undefined" disabled>
                    Select Type
                  </option>
                  <option value="specialize">Specialize</option>
                  <option value="union">Union</option>
                </select>
              </td>
            </tr>
            {content}
          </tbody>
        </table>
        <div className="buttons-list">
          <button
            className="properties-neutral-button"
            type="button"
            //onClick={() => {}}
          >
            Add Entity
          </button>
          <button
            className="properties-delete-button"
            type="button"
            onClick={() => {
              this.props.deleteExtension({ id: this.props.selector.current.id });
              this.props.deselect();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

const Specialize = (props) => {
  return (
    <>
      <tr>
        <td>Participation:</td>
        <td>
          <select id="participation" value={props.extension.participation} onChange={props.handleModifyExtension}>
            <option value="partial">Partial</option>
            <option value="total">Total</option>
          </select>
        </td>
      </tr>
      <tr>
        <td>Cardinality:</td>
        <td>
          <select id="cardinality" value={props.extension.cardinality} onChange={props.handleModifyExtension}>
            <option value="disjoint">Disjoint</option>
            <option value="overlap">Overlap</option>
          </select>
        </td>
      </tr>
    </>
  );
};

const Union = (props) => {
  return (
    <>
      <tr>
        <td>Participation:</td>
        <td>
          <select id="participation" value={props.extension.participation} onChange={props.handleModifyExtension}>
            <option value="partial">Partial</option>
            <option value="partial">Total</option>
          </select>
        </td>
      </tr>
      <tr>
        <td colSpan="2">This Entity is a Union of:</td>
      </tr>
    </>
  );
};

const mapStateToProps = (state) => ({
  components: state.components,
  selector: state.selector,
});

const mapDispatchToProps = {
  modifyExtension,
  deleteExtension,
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(ExtensionProperties);
