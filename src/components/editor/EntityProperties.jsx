import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  setNameEntity,
  addAttribute,
  addExtension,
  deleteChildren,
  deleteEntity,
  deleteConnection,
  deleteXConnection,
  select,
  deselect,
  setTypeEntity,
  repositionComponents,
} from "../../actions/actions";
import { randomPolarToXYCoords } from "../../global/utils";
import { nameSize, spawnRadius } from "../../global/constants";
import { getComponentById } from "../../global/globalFuncs";

const EntityProperties = (props) => {
  // Grab DOM reference to the name input field
  const nameInput = useRef(null);

  useEffect(() => {
    // Focus name input when the entity is selected
    nameInput.current.focus();
  }, [props.selector.current.id]);

  // Name text is selected when name input is focused
  const handleFocus = (e) => e.target.select();

  const nameValueChange = (e) =>
    props.setNameEntity({
      id: props.selector.current.id,
      name: e.target.value,
    });

  const typeValueChange = (e) =>
    props.setTypeEntity({
      id: props.selector.current.id,
      type: e.target.value,
    });

  const handleAddAttribute = (entity) => {
    // Randomly position the attribute around the entity
    const xyOffsets = randomPolarToXYCoords(spawnRadius);

    props.addAttribute({
      id: props.selector.current.id,
      x: entity.x + xyOffsets.xOffset,
      y: entity.y + xyOffsets.yOffset,
    });
    props.repositionComponents();
    props.select({
      type: "attribute",
      id: props.components.count + 1,
      parentId: props.selector.current.id,
    });
  };

  const handleAddExtension = (entity) => {
    // Randomly position the extension around the entity
    const xyOffsets = randomPolarToXYCoords(spawnRadius);

    props.addExtension({
      id: props.selector.current.id,
      x: entity.x + xyOffsets.xOffset,
      y: entity.y + xyOffsets.yOffset,
    });
    props.repositionComponents();
    props.select({
      type: "extension",
      id: props.components.count + 1,
      parentId: props.selector.current.id,
    });
  };

  const entity = getComponentById(props.selector.current.id);

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
          ref={nameInput}
          onFocus={handleFocus}
          maxLength={nameSize}
          value={entity.name}
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
                  type="radio"
                  name="type"
                  value="regular"
                  checked={entity.type === "regular"}
                  onChange={typeValueChange}
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
                  onChange={typeValueChange}
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
                  onChange={typeValueChange}
                />
                Associative
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <div className="buttons-list">
        <button className="properties-neutral-button" type="button" onClick={() => handleAddAttribute(entity)}>
          New Attribute
        </button>
        <button className="properties-neutral-button" type="button" onClick={() => handleAddExtension(entity)}>
          Extend
        </button>
        <button
          className="properties-delete-button"
          type="button"
          onClick={() => {
            props.deleteConnection({
              id: null,
              parentId: null,
              connectId: props.selector.current.id,
            });
            props.deleteXConnection({
              xconnectionId: null,
              entityId: props.selector.current.id,
            });
            props.deleteChildren({ id: props.selector.current.id });
            props.deleteEntity({ id: props.selector.current.id });
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
  setNameEntity,
  addAttribute,
  addExtension,
  deleteChildren,
  deleteEntity,
  deleteConnection,
  deleteXConnection,
  select,
  deselect,
  setTypeEntity,
  repositionComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(EntityProperties);
