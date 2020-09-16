import React from "react";
import { connect } from "react-redux";
import {
  addAttribute,
  setNameAttribute,
  setTypeAttribute,
  deleteChildren,
  deleteAttribute,
  select,
  deselect,
  repositionComponents,
} from "../../actions/actions";
import { getRandomInt } from "../../global/utils";

class AttributeProperties extends React.Component {
  findAttributeIndex = (attribute) => attribute.id === this.props.selector.current.id;

  findParentIndex = (parent) => parent.id === this.props.selector.current.parentId;

  nameValueChange = (e) =>
    this.props.setNameAttribute({
      id: this.props.selector.current.id,
      name: e.target.value,
    });

  typeValueChange = (e) => {
    if (e.target.value === "composite") this.props.deleteChildren({ id: this.props.selector.current.id });
    this.props.setTypeAttribute({
      id: this.props.selector.current.id,
      type: e.target.value,
    });
  };

  handleAddAttributeToParent = (parent) => {
    const radius = this.props.stager.attributeSpawnRadius;
    var randomAngle = getRandomInt(0, 360);
    var xOffset = radius * Math.cos(randomAngle);
    var yOffset = radius * Math.sin(randomAngle);
    var x;
    var y;
    switch (parent.type) {
      case "entity":
        x = this.props.components.entities[parent.index].x + xOffset;
        y = this.props.components.entities[parent.index].y + yOffset;
        break;
      case "relationship":
        x = this.props.components.relationships[parent.index].x + xOffset;
        y = this.props.components.relationships[parent.index].y + yOffset;
        break;
      case "attribute":
        x = this.props.components.attributes[parent.index].x + xOffset;
        y = this.props.components.attributes[parent.index].y + yOffset;
        break;
      default:
        x = this.props.stager.stageWidth / 2;
        y = this.props.stager.stageHeight / 2;
    }
    this.props.addAttribute({
      id: this.props.selector.current.parentId,
      x: x,
      y: y,
    });
    this.props.repositionComponents();
    this.props.select({
      type: "attribute",
      id: this.props.components.count + 1,
      parentId: this.props.selector.current.parentId,
    });
  };

  handleAddAttribute = (attributeIndex) => {
    const radius = this.props.stager.attributeSpawnRadius;
    var randomAngle = getRandomInt(0, 360);
    var xOffset = radius * Math.cos(randomAngle);
    var yOffset = radius * Math.sin(randomAngle);
    this.props.addAttribute({
      id: this.props.selector.current.id,
      x: this.props.components.attributes[attributeIndex].x + xOffset,
      y: this.props.components.attributes[attributeIndex].y + yOffset,
    });
    this.props.repositionComponents();
    this.props.select({
      type: "attribute",
      id: this.props.components.count + 1,
      parentId: this.props.selector.current.id,
    });
  };

  render() {
    var parent = { index: null, type: "" };

    if ((parent.index = this.props.components.entities.findIndex(this.findParentIndex)) !== -1) parent.type = "entity";
    else if ((parent.index = this.props.components.relationships.findIndex(this.findParentIndex)) !== -1)
      parent.type = "relationship";
    else if ((parent.index = this.props.components.attributes.findIndex(this.findParentIndex)) !== -1)
      parent.type = "attribute";

    var attributeIndex = this.props.components.attributes.findIndex(this.findAttributeIndex);

    var addAttributeButton = this.props.components.attributes[attributeIndex].type.composite ? (
      <button
        className="properties-neutral-button"
        type="button"
        onClick={() => this.handleAddAttribute(attributeIndex)}
      >
        New Attribute
      </button>
    ) : null;

    return (
      <div className="sidepanel-content">
        <h3>Attribute</h3>
        <label>
          Name:{" "}
          <input
            className="big-editor-input"
            type="text"
            name="name"
            id="name"
            maxLength={this.props.stager.nameSize}
            value={this.props.components.attributes[attributeIndex].name}
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
                    type="checkbox"
                    name="type"
                    value="unique"
                    checked={this.props.components.attributes[attributeIndex].type.unique}
                    onChange={this.typeValueChange}
                  />
                  Unique
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  <input
                    type="checkbox"
                    name="type"
                    value="multivalued"
                    checked={this.props.components.attributes[attributeIndex].type.multivalued}
                    onChange={this.typeValueChange}
                  />
                  Multivalued
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  <input
                    type="checkbox"
                    name="type"
                    value="optional"
                    checked={this.props.components.attributes[attributeIndex].type.optional}
                    onChange={this.typeValueChange}
                  />
                  Optional
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  <input
                    type="checkbox"
                    name="type"
                    value="composite"
                    checked={this.props.components.attributes[attributeIndex].type.composite}
                    onChange={this.typeValueChange}
                  />
                  Composite
                </label>
              </td>
            </tr>
            <tr>
              <td>
                <label>
                  <input
                    type="checkbox"
                    name="type"
                    value="derived"
                    checked={this.props.components.attributes[attributeIndex].type.derived}
                    onChange={this.typeValueChange}
                  />
                  Derived
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
            onClick={() => this.handleAddAttributeToParent(parent)}
          >
            Add Attribute to Parent
          </button>
          {addAttributeButton}
          <button
            className="properties-delete-button"
            type="button"
            onClick={() => {
              this.props.deleteChildren({ id: this.props.selector.current.id });
              this.props.deleteAttribute({
                id: this.props.selector.current.id,
              });
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
  addAttribute,
  setNameAttribute,
  setTypeAttribute,
  deleteChildren,
  deleteAttribute,
  select,
  deselect,
  repositionComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(AttributeProperties);
