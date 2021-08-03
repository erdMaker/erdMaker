import { useEffect, useRef, Fragment } from "react";
import { connect } from "react-redux";
import {
  addAttribute,
  setNameRelationship,
  setTypeRelationship,
  select,
  deselect,
  deleteChildren,
  deleteRelationship,
  addConnection,
  repositionComponents,
} from "../../actions/actions";
import Connection from "./Connection";
import { randomPolarToXYCoords } from "../../global/utils";
import { nameSize, spawnRadius } from "../../global/constants";
import { getComponentById } from "../../global/globalFuncs";

const RelationshipProperties = (props) => {
  // Grab DOM reference to the name input field
  const nameInput = useRef(null);

  useEffect(() => {
    // Focus name input when the relationship is selected
    nameInput.current.focus();
  }, [props.selector.current.id]);

  // Name text is selected when name input is focused
  const handleFocus = (e) => e.target.select();

  const nameValueChange = (e) =>
    props.setNameRelationship({
      id: props.selector.current.id,
      name: e.target.value,
    });

  const typeValueChange = (e) => {
    props.setTypeRelationship({
      id: props.selector.current.id,
      type: e.target.value,
      checked: e.target.checked,
    });
  };

  const handleAddAttribute = (relationship) => {
    // Randomly position the attribute around the relationship
    const xyOffsets = randomPolarToXYCoords(spawnRadius);

    props.addAttribute({
      id: props.selector.current.id,
      x: relationship.x + xyOffsets.xOffset,
      y: relationship.y + xyOffsets.yOffset,
    });
    props.repositionComponents();
    props.select({
      type: "attribute",
      id: props.components.count + 1,
      parentId: props.selector.current.id,
    });
  };

  const relationship = getComponentById(props.selector.current.id);

  // addConnectionButton is enabled while the relationship has less than five connections
  const addConnectionButton =
    relationship.connections.length < 5 ? (
      <button
        className="properties-neutral-button"
        type="button"
        onClick={() => {
          props.addConnection({ id: props.selector.current.id });
        }}
      >
        Add Connection
      </button>
    ) : null;

  return (
    <div className="sidepanel-content">
      <h3>Relationship</h3>
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
          value={relationship.name}
          onChange={nameValueChange}
        />
      </label>
      <hr />
      <table className="type-inputs">
        <tbody>
          <tr>
            <td>Type:</td>
            <td>
              <label>
                <input
                  type="checkbox"
                  name="type"
                  value="weak"
                  checked={relationship.type.weak}
                  onChange={typeValueChange}
                />
                Identifying
              </label>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <div className="connections-list">
        <Connections
          selected={props.selector.current}
          entities={props.components.entities}
          relationships={props.components.relationships}
          relationship={relationship}
        />
      </div>
      {addConnectionButton}
      <hr />
      <div className="buttons-list">
        <button className="properties-neutral-button" type="button" onClick={() => handleAddAttribute(relationship)}>
          New Attribute
        </button>
        <button
          className="properties-delete-button"
          type="button"
          onClick={() => {
            props.deleteChildren({ id: props.selector.current.id });
            props.deleteRelationship({
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

// Component for all connections
const Connections = (props) => {
  const connectionList = [];
  for (let i in props.relationship.connections) {
    connectionList.push(
      <Fragment key={i}>
        <Connection index={i} connection={props.relationship.connections[i]} relationshipId={props.selected.id} />
      </Fragment>
    );
  }
  return connectionList;
};

const mapStateToProps = (state) => ({
  components: state.components,
  selector: state.selector,
});

const mapDispatchToProps = {
  addAttribute,
  setNameRelationship,
  setTypeRelationship,
  select,
  deselect,
  deleteChildren,
  deleteRelationship,
  addConnection,
  repositionComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(RelationshipProperties);
