import { Component } from "react";
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
import { nameSize, spawnRadius } from "../../global/constants";
import { getComponentById } from "../../global/globalFuncs";

class AttributeProperties extends Component {
  componentDidMount() {
    this.nameInput.focus();
  }

  handleFocus = (e) => e.target.select();

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
      checked: e.target.checked,
    });
  };

  handleAddAttributeToParent = (parent) => {
    const radius = spawnRadius;
    var randomAngle = getRandomInt(0, 360);
    var xOffset = radius * Math.cos(randomAngle);
    var yOffset = radius * Math.sin(randomAngle);
    var x = parent.x + xOffset;
    var y = parent.y + yOffset;

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
    this.nameInput.focus();
  };

  handleAddAttribute = (attribute) => {
    // Randomly position the attribute around the attribute
    const radius = spawnRadius;
    var randomAngle = getRandomInt(0, 360);
    var xOffset = radius * Math.cos(randomAngle);
    var yOffset = radius * Math.sin(randomAngle);
    this.props.addAttribute({
      id: this.props.selector.current.id,
      x: attribute.x + xOffset,
      y: attribute.y + yOffset,
    });
    this.props.repositionComponents();
    this.props.select({
      type: "attribute",
      id: this.props.components.count + 1,
      parentId: this.props.selector.current.id,
    });
    this.nameInput.focus();
  };

  render() {
    var parent = getComponentById(this.props.selector.current.parentId);

    var uniqueLabel = parent.type === "weak" ? "Partially Unique" : "Unique";

    var attribute = getComponentById(this.props.selector.current.id);

    // addAttributeButton is enabled only for composite attributes
    var addAttributeButton = attribute.type.composite ? (
      <button className="properties-neutral-button" type="button" onClick={() => this.handleAddAttribute(attribute)}>
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
            ref={(input) => {
              this.nameInput = input;
            }}
            onFocus={this.handleFocus}
            maxLength={nameSize}
            value={attribute.name}
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
                    checked={attribute.type.unique}
                    onChange={this.typeValueChange}
                  />
                  {uniqueLabel}
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
                    checked={attribute.type.multivalued}
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
                    checked={attribute.type.optional}
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
                    checked={attribute.type.composite}
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
                    checked={attribute.type.derived}
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
