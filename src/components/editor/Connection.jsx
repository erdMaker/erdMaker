import React from "react";
import { connect } from "react-redux";
import { changeConnection, deleteConnection, modifyConnection } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import DeleteIcon from "@material-ui/icons/Delete";

class Connection extends React.Component {
  constructor() {
    super();
    this.state = { expand: false };
  }

  findRelationshipIndex = (relationship) => relationship.id === this.props.selector.current.id;

  findConnectionIndex = (connection) => connection.id === this.props.connection.id;

  handleEntityChange = (e) =>
    this.props.changeConnection({
      id: this.props.connection.id,
      parentid: this.props.relationshipId,
      connectid: e.target.value,
    });

  handleModifyConnection = (e) =>
    this.props.modifyConnection({
      id: this.props.connection.id,
      parentid: this.props.relationshipId,
      prop: e.target.id,
      value: e.target.value,
    });

  handleExpand = () => this.setState({ expand: !this.state.expand });

  render() {
    var parentIndex = this.props.components.relationships.findIndex(this.findRelationshipIndex);
    var childIndex = this.props.components.relationships[parentIndex].connections.findIndex(this.findConnectionIndex);
    var specificValues = this.state.expand ? (
      <>
        <div className="connection-input-group">
          <label>
            Min:
            <input
              id="exactMin"
              className="small-editor-input"
              type="text"
              maxLength="7"
              value={this.props.connection.exactMin}
              onChange={this.handleModifyConnection}
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
              value={this.props.connection.exactMax}
              onChange={this.handleModifyConnection}
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
              style={{width: "150px", marginTop: "10px"}}
              type="text"
              maxLength="15"
              value={this.props.connection.role}
              onChange={this.handleModifyConnection}
            />
          </label>
        </div>
      </>
    ) : null;

    var expandIcon = this.state.expand ? <ExpandLessIcon /> : <ExpandMoreIcon />;

    return (
      <div className="connection" style={{backgroundColor: this.props.index%2 ? "#c9c9c9" : "#dfdfdf"}}>
        <div className="connection-input-group">
          <label>
            <b>Entity: </b>
            <select
              value={this.props.components.relationships[parentIndex].connections[childIndex].connectid}
              onChange={this.handleEntityChange}
            >
              <option value="" disabled>
                Select an Entity
              </option>
              <EntityList
                entities={this.props.components.entities}
                connections={this.props.components.relationships[this.props.relationshipIndex].connections}
              />
            </select>
          </label>
        </div>
        <IconButton
          onClick={() => {
            this.props.deleteConnection({
              id: this.props.connection.id,
              parentid: this.props.selector.current.id,
              connectid: this.props.connection.connectid,
            });
          }}
        >
          <DeleteIcon />
        </IconButton>
        <br />
        <div className="connection-input-group">
          <label>
            Min:{" "}
            <select id="min" value={this.props.connection.min} onChange={this.handleModifyConnection}>
              <option value="">Undefined</option>
              <option value="zero">Zero</option>
              <option value="one">One</option>
            </select>
          </label>
        </div>
        <div className="connection-input-group">
          <label>
            Max:{" "}
            <select id="max" value={this.props.connection.max} onChange={this.handleModifyConnection}>
              <option value="">Undefined</option>
              <option value="one">One</option>
              <option value="many">Many</option>
            </select>
          </label>
        </div>
        <IconButton onClick={this.handleExpand}>{expandIcon}</IconButton>
        <br />
        {specificValues}
      </div>
    );
  }
}

const EntityList = (props) => {
  let entityList = [];
  for (let i in props.entities) {
    entityList.push(
      <option key={i} value={props.entities[i].id}>
        {props.entities[i].name}
      </option>
    );
  }
  return entityList;
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
