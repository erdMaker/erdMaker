import React from "react";
import { connect } from "react-redux";
import {
  setNameEntity,
  addAttribute,
  deleteChildren,
  deleteEntity,
  deleteConnection,
  select,
  deselect,
  setTypeEntity,
  repositionComponents,
} from "../../actions/actions";
import { getRandomInt } from "../../global/utils";
import { nameSize, attributeSpawnRadius } from "../../global/constants";

class EntityProperties extends React.Component {
  findEntityIndex = (entity) => entity.id === this.props.selector.current.id;

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

  handleAddAttribute = (entityIndex) => {
    // Randomly position the attribute around the entity
    const radius = attributeSpawnRadius;
    var randomAngle = getRandomInt(0, 360);
    var xOffset = radius * Math.cos(randomAngle);
    var yOffset = radius * Math.sin(randomAngle);
    this.props.addAttribute({
      id: this.props.selector.current.id,
      x: this.props.components.entities[entityIndex].x + xOffset,
      y: this.props.components.entities[entityIndex].y + yOffset,
    });
    this.props.repositionComponents();
    this.props.select({
      type: "attribute",
      id: this.props.components.count + 1,
      parentId: this.props.selector.current.id,
    });
  };

  render() {
    var entityIndex = this.props.components.entities.findIndex(this.findEntityIndex);
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
            maxLength={nameSize}
            value={this.props.components.entities[entityIndex].name}
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
                    checked={this.props.components.entities[entityIndex].type === "regular"}
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
                    checked={this.props.components.entities[entityIndex].type === "weak"}
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
                    checked={this.props.components.entities[entityIndex].type === "associative"}
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
          <button
            className="properties-neutral-button"
            type="button"
            onClick={() => this.handleAddAttribute(entityIndex)}
          >
            New Attribute
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
  stager: state.stager,
});

const mapDispatchToProps = {
  setNameEntity,
  addAttribute,
  deleteChildren,
  deleteEntity,
  deleteConnection,
  select,
  deselect,
  setTypeEntity,
  repositionComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityProperties);
