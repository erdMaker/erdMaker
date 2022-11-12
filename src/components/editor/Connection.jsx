import { useState } from "react";
import { connect } from "react-redux";
import { changeConnection, deleteConnection, modifyConnection } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import DeleteIcon from "@material-ui/icons/Delete";

const Connection = (props) => {
  const [expand, setExpand] = useState(false);

  const handleEntityChange = (e) => {
    props.changeConnection({
      id: props.connection.id,
      parentId: props.relationshipId,
      connectId: Number(e.target.value),
    });
  };

  const handleModifyConnection = (e) => {
    props.modifyConnection({
      id: props.connection.id,
      parentId: props.relationshipId,
      prop: e.target.id,
      value: e.target.value,
    });
  };

  const handleExpand = () => setExpand(!expand);

  const specificValues = expand ? (
    <>
      <div className="connection-input-group">
        <label>
          Min:
          <input
            id="exactMin"
            className="small-editor-input"
            type="text"
            maxLength="7"
            value={props.connection.exactMin}
            onChange={handleModifyConnection}
          />
        </label>
      </div>
      <div className="connection-input-group">
        <label>
          Max:
          <input
            id="exactMax"
            className="small-editor-input"
            type="text"
            maxLength="7"
            value={props.connection.exactMax}
            onChange={handleModifyConnection}
          />
        </label>
      </div>
      <br />
      <div className="connection-input-group">
        <label>
          Role:
          <input
            id="role"
            className="small-editor-input"
            style={{ width: "150px", marginTop: "10px" }}
            type="text"
            maxLength="15"
            value={props.connection.role}
            onChange={handleModifyConnection}
          />
        </label>
      </div>
    </>
  ) : null;

  const expandIcon = expand ? <ExpandLessIcon /> : <ExpandMoreIcon />;

  return (
    <div className="connection" style={{ backgroundColor: props.index % 2 ? "#c9c9c9" : "#dfdfdf" }}>
      <div className="connection-input-group">
        <label>
          <b>Entity:</b>
          <select value={props.connection.connectId} onChange={handleEntityChange}>
            <option value={0} disabled>
              Select an Entity
            </option>
            {props.components.entities.map((entity) => (
              <option key={entity.id} value={entity.id} disabled={entity.connectionCount >= 8 ? true : false}>
                {entity.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <IconButton
        onClick={() => {
          props.deleteConnection({
            id: props.connection.id,
            parentId: props.selector.current.id,
            connectId: props.connection.connectId,
          });
        }}
      >
        <DeleteIcon />
      </IconButton>
      <br />
      <div className="connection-input-group">
        <label>
          Min:
          <select id="min" value={props.connection.min} onChange={handleModifyConnection}>
            <option value="">Undefined</option>
            <option value="zero">Zero</option>
            <option value="one">One</option>
          </select>
        </label>
      </div>
      <div className="connection-input-group">
        <label>
          Max:
          <select id="max" value={props.connection.max} onChange={handleModifyConnection}>
            <option value="">Undefined</option>
            <option value="one">One</option>
            <option value="many">Many</option>
          </select>
        </label>
      </div>
      <IconButton onClick={handleExpand}>{expandIcon}</IconButton>
      <br />
      {specificValues}
    </div>
  );
};

const mapStateToProps = (state) => ({
  components: state.components,
  selector: state.selector,
});

const mapDispatchToProps = {
  changeConnection,
  deleteConnection,
  modifyConnection,
};

export default connect(mapStateToProps, mapDispatchToProps)(Connection);
