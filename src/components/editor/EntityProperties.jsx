import { Component } from "react";
import { connect } from "react-redux";
import {
  setNameEntity,
  addAttribute,
  addExtension,
  deleteChildren,
  deleteEntity,
  deleteConnection,
  select,
  deselect,
  setTypeEntity,
  repositionComponents,
} from "../../actions/actions";
import { getRandomInt } from "../../global/utils";
import { nameSize, spawnRadius } from "../../global/constants";
import { getComponentById } from "../../global/globalFuncs";

class EntityProperties extends Component {
  componentDidMount() {
    this.nameInput.focus();
  }

  handleFocus = (e) => e.target.select();

  nameValueChange = (e) =>
    this.props.setNameEntity({
      id: this.props.selector.current.id,
      name: e.target.value,
    });

  typeValueChange = (e) =>
    this.props.setTypeEntity({
      id: this.props.selector.current.id,
      type: e.target.value,
    });

  handleAddAttribute = (entity) => {
    // Randomly position the attribute around the entity
    const radius = spawnRadius;
    var randomAngle = getRandomInt(0, 360);
    var xOffset = radius * Math.cos(randomAngle);
    var yOffset = radius * Math.sin(randomAngle);
    this.props.addAttribute({
      id: this.props.selector.current.id,
      x: entity.x + xOffset,
      y: entity.y + yOffset,
    });
    this.props.repositionComponents();
    this.props.select({
      type: "attribute",
      id: this.props.components.count + 1,
      parentId: this.props.selector.current.id,
    });
  };

  handleAddExtension = (entity) => {
    // Randomly position the extension around the entity
    const radius = spawnRadius;
    var randomAngle = getRandomInt(0, 360);
    var xOffset = radius * Math.cos(randomAngle);
    var yOffset = radius * Math.sin(randomAngle);
    this.props.addExtension({
      id: this.props.selector.current.id,
      x: entity.x + xOffset,
      y: entity.y + yOffset,
    });
    this.props.repositionComponents();
    this.props.select({
      type: "extension",
      id: this.props.components.count + 1,
      parentId: this.props.selector.current.id,
    });
  };

  render() {
    var entity = getComponentById(this.props.selector.current.id);
    return (
      <div className="sidepanel-content">
        <h3>Entity</h3>
        <label>
          Name:{" "}
          <input
            className="big-editor-input"
            type="text"
            name="name"
            id="name"
            ref={(input) => {
              this.nameInput = input;
            }}
            onFocus={this.handleFocus}
            maxLength={nameSize}
            value={entity.name}
            onChange={this.nameValueChange}
          />
        </label>
        <hr />
        <h3>Type</h3>
        <table className="type-inputs">
          <tbody>
            <tr>
              <td>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="regular"
                    checked={entity.type === "regular"}
                    onChange={this.typeValueChange}
                  />
                  Regular
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="weak"
                    checked={entity.type === "weak"}
                    onChange={this.typeValueChange}
                  />
                  Weak
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  <input
                    type="radio"
                    name="type"
                    value="associative"
                    checked={entity.type === "associative"}
                    onChange={this.typeValueChange}
                  />
                  Associative
                </label>
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div className="buttons-list">
          <button className="properties-neutral-button" type="button" onClick={() => this.handleAddAttribute(entity)}>
            New Attribute
          </button>
          <button className="properties-neutral-button" type="button" onClick={() => this.handleAddExtension(entity)}>
            New Extension
          </button>
          <button
            className="properties-delete-button"
            type="button"
            onClick={() => {
              this.props.deleteConnection({
                id: null,
                parentId: null,
                connectId: this.props.selector.current.id,
              });
              this.props.deleteChildren({ id: this.props.selector.current.id });
              this.props.deleteEntity({ id: this.props.selector.current.id });
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

const mapStateToProps = (state) => ({
  components: state.components,
  selector: state.selector,
});

const mapDispatchToProps = {
  setNameEntity,
  addAttribute,
  addExtension,
  deleteChildren,
  deleteEntity,
  deleteConnection,
  select,
  deselect,
  setTypeEntity,
  repositionComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityProperties);
