import { connect } from "react-redux";
import {
  modifyExtension,
  deleteExtension,
  deselect,
  addXConnection,
  changeXConnection,
  deleteXConnection,
} from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { getComponentById } from "../../global/globalFuncs";

const ExtensionProperties = (props) => {
  const handleModifyExtension = (e) => {
    props.modifyExtension({
      id: props.selector.current.id,
      prop: e.target.id,
      value: e.target.value,
    });
  };

  const extension = getComponentById(props.selector.current.id);
  const parent = getComponentById(props.selector.current.parentId);
  let content;
  if (extension.type === "specialize")
    content = <Specialize extension={extension} parent={parent} handleModifyExtension={handleModifyExtension} />;
  else if (extension.type === "union")
    content = <Union extension={extension} parent={parent} handleModifyExtension={handleModifyExtension} />;
  else content = null;

  const addEntityButton =
    extension.type !== "undefined" && extension.xconnections.length < 30 ? (
      <button
        className="properties-neutral-button"
        type="button"
        onClick={() => {
          props.addXConnection({ id: props.selector.current.id });
        }}
      >
        Add Entity
      </button>
    ) : null;

  return (
    <div className="sidepanel-content">
      <h3>Extension</h3>
      <div className="extension-group">
        Type:
        <select id="type" value={extension.type} onChange={handleModifyExtension}>
          <option value="undefined" disabled>
            Select Type
          </option>
          <option value="specialize">Specialize</option>
          <option value="union">Union</option>
        </select>
      </div>
      {content}
      <div className="connections-list">
        <XConnections extension={extension} />
      </div>
      <div className="buttons-list">
        {addEntityButton}
        <button
          className="properties-delete-button"
          type="button"
          onClick={() => {
            props.deleteExtension({ id: props.selector.current.id });
            props.deselect();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const Specialize = (props) => {
  return (
    <>
      <div className="extension-group">
        Participation:
        <select id="participation" value={props.extension.participation} onChange={props.handleModifyExtension}>
          <option value="partial">Partial</option>
          <option value="total">Total</option>
        </select>
      </div>
      <div className="extension-group">
        Cardinality:
        <select id="cardinality" value={props.extension.cardinality} onChange={props.handleModifyExtension}>
          <option value="disjoint">Disjoint</option>
          <option value="overlap">Overlap</option>
        </select>
      </div>
      <hr />
      <div className="extension-group">{props.parent.name} specializes at:</div>
    </>
  );
};

const Union = (props) => {
  return (
    <>
      <div className="extension-group">
        Participation:
        <select id="participation" value={props.extension.participation} onChange={props.handleModifyExtension}>
          <option value="partial">Partial</option>
          <option value="total">Total</option>
        </select>
      </div>
      <hr />
      <div className="extension-group">{props.parent.name} is a Union of:</div>
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
  addXConnection,
  changeXConnection,
  deleteXConnection,
};

// Component for all extension connections
const XConnections = connect(
  mapStateToProps,
  mapDispatchToProps
)((props) => {
  const xconnectionList = [];
  const handleChangeXConnection = (xconnectionId, e) =>
    props.changeXConnection({
      id: props.extension.id,
      xconnectionId: xconnectionId,
      connectId: Number(e.target.value),
    });

  for (let xconnection of props.extension.xconnections) {
    xconnectionList.push(
      <span key={xconnection.id} style={{ margin: "auto", marginBottom: "10px" }}>
        <select value={xconnection.connectId} onChange={(e) => handleChangeXConnection(xconnection.id, e)}>
          <option value={0} disabled>
            Select Entity
          </option>
          <XEntityList extension={props.extension} />
        </select>
        <IconButton
          onClick={() => {
            props.deleteXConnection({
              xconnectionId: xconnection.id,
              entityId: null
            });
          }}
        >
          <DeleteIcon />
        </IconButton>
      </span>
    );
  }
  return <div style={{ display: "flex", flexDirection: "column" }}>{xconnectionList}</div>;
});

const XEntityList = connect(
  mapStateToProps,
  mapDispatchToProps
)((props) => {
  const entityList = [];
  let found;
  for (let entity of props.components.entities) {
    found = false;
    if (entity.id === props.extension.parentId) continue;
    for (let xconnection of props.extension.xconnections) {
      if (entity.id === xconnection.connectId) {
        found = true;
        break;
      }
    }
    entityList.push(
      <option key={entity.id} value={entity.id} disabled={found}>
        {entity.name}
      </option>
    );
  }
  return entityList;
});

export default connect(mapStateToProps, mapDispatchToProps)(ExtensionProperties);
