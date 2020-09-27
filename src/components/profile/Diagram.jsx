import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setActiveDiagram } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { duplicatediagram, deletediagram } from "../../global/diagramRequests";
import editImg from "../../img/edit.png";
import { getProfile } from "../../global/globalFuncs";
import axios from "axios";

class Diagram extends React.Component {
  handleClick = () => {
    this.props.setActiveDiagram(this.props.user.diagrams[this.props.index].id);
  };

  // Calculates how much time has passed since each diagram got updated
  calculateLastUpdate = () => {
    var lastUpdate;
    var updatedAt = this.props.user.diagrams[this.props.index].updatedAt;
    var newUpdatedAt = Date.parse(updatedAt);
    var currServerTime = Date.parse(this.props.general.serverTime);
    var difference = currServerTime - newUpdatedAt;
    var inDays = difference / 86400000;
    var inHours = difference / 3600000;
    var inMinutes = difference / 60000;
    var inSeconds = difference / 1000;
    if (inDays >= 1) lastUpdate = Math.floor(inDays) + " day(s) ago";
    else if (inHours >= 1) lastUpdate = Math.floor(inHours) + " hour(s) ago";
    else if (inMinutes >= 1) lastUpdate = Math.floor(inMinutes) + " minute(s) ago";
    else lastUpdate = Math.floor(inSeconds) + " second(s) ago";
    return lastUpdate;
  };

  render() {
    var lastUpdate = this.calculateLastUpdate();
    return (
      <tr>
        <td>
          <Link className="title-link" to="/designer" onClick={this.handleClick}>
            {this.props.user.diagrams[this.props.index].title}
          </Link>
        </td>
        <td>
          <img className="edit-icon" src={editImg} alt=":(" /> {lastUpdate}
        </td>
        <td>
          <SimpleMenu
            id={this.props.user.diagrams[this.props.index].id}
            diagramsOwned={this.props.user.diagramsOwned}
            diagramLimit={this.props.general.diagramLimit}
          />
        </td>
      </tr>
    );
  }
}

const SimpleMenu = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const cancelToken = useRef(null);

  useEffect(() => {
    cancelToken.current = axios.CancelToken.source();
    return () => {
      cancelToken.current.cancel("Request is being canceled");
    };
  }, []);

  const handleDuplicate = () => {
    duplicatediagram(props.id, cancelToken.current)
      .then((res) => {
        getProfile(cancelToken.current);
      })
      .catch(() => {});
  };

  const handleDelete = () => {
    deletediagram(props.id, cancelToken.current)
      .then((res) => {
        getProfile(cancelToken.current);
      })
      .catch(() => {});
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="more" aria-controls="long-menu" aria-haspopup="true" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          disabled={props.diagramsOwned >= props.diagramLimit ? true : false}
          onClick={() => {
            handleClose();
            handleDuplicate();
          }}
        >
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            handleDelete();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
  general: state.general,
});

const mapDispatchToProps = {
  setActiveDiagram,
};

export default connect(mapStateToProps, mapDispatchToProps)(Diagram);
