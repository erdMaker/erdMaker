import React from "react";
import { connect } from "react-redux";
import { changeConnection, deleteConnection, modifyConnection } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import DeleteIcon from "@material-ui/icons/Delete";

class Connection extends React.Component {
  state = { expand: false };

  findRelationshipIndex = (relationship) => relationship.id === this.props.selector.current.id;

  findConnectionIndex = (connection) => connection.id === this.props.connection.id;

  handleEntityChange = (e) =>
    this.props.changeConnection({
      id: this.props.connection.id,
      parentId: this.props.relationshipId,
      connectId: Number(e.target.value),
    });

  handleModifyConnection = (e) => {
    this.props.modifyConnection({
      id: this.props.connection.id,
      parentId: this.props.relationshipId,
      prop: e.target.id,
      value: e.target.value,
    });
    // If user changes participation and cardinality then adjust relevant attributes
    if (e.target.id === "min") {
      if (e.target.value === "zero") {
        // If user selects minimum = zero then exact min value becomes 0
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "exactMin",
          value: "0",
        });
      } else if (e.target.value === "one") {
        // If user selects minimum = one then exact min value becomes 1
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "exactMin",
          value: "1",
        });
      } else {
        // If user selects minimum = undefined then exact min value becomes empty
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "exactMin",
          value: "",
        });
      }
    } else if (e.target.id === "max") {
      if (e.target.value === "one") {
        // If user selects maximum = one then exact max value becomes 1
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "exactMax",
          value: "1",
        });
      }
    } else if (e.target.id === "exactMin") {
      if (e.target.value === "0") {
        // If user selects exactMinimum = 0 then minimum value becomes zero
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "min",
          value: "zero",
        });
      } else if (e.target.value === "1") {
        // If user selects exactMinimum = 1 then minimum value becomes one
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "min",
          value: "one",
        });
      } else {
        // If user selects exactMinimum  other than 0 or 1 then minimum becomes empty
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "min",
          value: "",
        });
      }
    } else if (e.target.id === "exactMax") {
      if (e.target.value === "1") {
        // If user selects exactMaximum = 1 then maximum value becomes one
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "max",
          value: "one",
        });
      } else if (e.target.value === "") {
        // If user selects exactMaximum empty then maximum value becomes undefined
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "max",
          value: "undefined",
        });
      } else {
        // If user selects exactMaximum other than 1 or empty then maximum value becomes many
        this.props.modifyConnection({
          id: this.props.connection.id,
          parentId: this.props.relationshipId,
          prop: "max",
          value: "many",
        });
      }
    }
  };

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
              //disabled={this.props.connection.min === "zero" || this.props.connection.min === "one" ? true : false}
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
              //disabled={this.props.connection.max === "one" ? true : false}
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
              value={this.props.connection.role}
              onChange={this.handleModifyConnection}
            />
          </label>
        </div>
      </>
    ) : null;

    var expandIcon = this.state.expand ? <ExpandLessIcon /> : <ExpandMoreIcon />;

    return (
      <div className="connection" style={{ backgroundColor: this.props.index % 2 ? "#c9c9c9" : "#dfdfdf" }}>
        <div className="connection-input-group">
          <label>
            <b>Entity: </b>
            <select
              value={this.props.components.relationships[parentIndex].connections[childIndex].connectId}
              onChange={this.handleEntityChange}
            >
              <option value={0} disabled>
                Select an Entity
              </option>
              {this.props.components.entities.map((entity) => (
                <option key={entity.id} value={entity.id} disabled={entity.connectionCount >= 8 ? true : false}>
                  {entity.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <IconButton
          onClick={() => {
            this.props.deleteConnection({
              id: this.props.connection.id,
              parentId: this.props.selector.current.id,
              connectId: this.props.connection.connectId,
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
