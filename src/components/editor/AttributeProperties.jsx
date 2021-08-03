import { useEffect, useRef } from "react";
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
import { randomPolarToXYCoords } from "../../global/utils";
import { nameSize, spawnRadius } from "../../global/constants";
import { getComponentById } from "../../global/globalFuncs";

const AttributeProperties = (props) => {
  // Grab DOM reference to the name input field
  const nameInput = useRef(null);

  useEffect(() => {
    // Focus name input when the attribute is selected
    nameInput.current.focus();
  }, [props.selector.current.id]);

  // Name text is selected when name input is focused
  const handleFocus = (e) => e.target.select();

  const nameValueChange = (e) =>
    props.setNameAttribute({
      id: props.selector.current.id,
      name: e.target.value,
    });

  const typeValueChange = (e) => {
    // Delete children attributes if attribute is no longer composite
    if (e.target.value === "composite") props.deleteChildren({ id: props.selector.current.id });

    props.setTypeAttribute({
      id: props.selector.current.id,
      type: e.target.value,
      checked: e.target.checked,
    });
  };

  const handleAddAttributeToParent = (parent) => {
    // Randomly position the attribute around the parent element
    const xyOffsets = randomPolarToXYCoords(spawnRadius);

    props.addAttribute({
      id: props.selector.current.parentId,
      x: parent.x + xyOffsets.xOffset,
      y: parent.y + xyOffsets.yOffset,
    });
    props.repositionComponents();
    props.select({
      type: "attribute",
      id: props.components.count + 1,
      parentId: props.selector.current.parentId,
    });
  };

  const handleAddAttribute = (attribute) => {
    // Randomly position the attribute around the attribute
    const xyOffsets = randomPolarToXYCoords(spawnRadius);

    props.addAttribute({
      id: props.selector.current.id,
      x: attribute.x + xyOffsets.xOffset,
      y: attribute.y + xyOffsets.yOffset,
    });
    props.repositionComponents();
    props.select({
      type: "attribute",
      id: props.components.count + 1,
      parentId: props.selector.current.id,
    });
  };

  const parent = getComponentById(props.selector.current.parentId);
  const attribute = getComponentById(props.selector.current.id);

  const uniqueLabel = parent.type === "weak" ? "Partially Unique" : "Unique";

  // addAttributeButton is enabled only for composite attributes
  const addAttributeButton = attribute.type.composite ? (
    <button className="properties-neutral-button" type="button" onClick={() => handleAddAttribute(attribute)}>
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
          ref={nameInput}
          onFocus={handleFocus}
          maxLength={nameSize}
          value={attribute.name}
          onChange={nameValueChange}
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
                  onChange={typeValueChange}
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
                  onChange={typeValueChange}
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
                  onChange={typeValueChange}
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
                  onChange={typeValueChange}
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
                  onChange={typeValueChange}
                />
                Derived
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <div className="buttons-list">
        <button className="properties-neutral-button" type="button" onClick={() => handleAddAttributeToParent(parent)}>
          Add Attribute to Parent
        </button>
        {addAttributeButton}
        <button
          className="properties-delete-button"
          type="button"
          onClick={() => {
            props.deleteChildren({ id: props.selector.current.id });
            props.deleteAttribute({
              id: props.selector.current.id,
            });
            props.deselect();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

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
