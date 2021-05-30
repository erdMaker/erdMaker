import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setActiveDiagram, resetComponents, resetMeta } from "../../actions/actions";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { duplicatediagram, deletediagram } from "../../global/diagramRequests";
import editImg from "../../img/edit.png";
import { getProfile } from "../../global/globalFuncs";
import axios from "axios";
import { diagramLimit } from "../../global/constants.js";
import { ConfirmCancelAction } from "../../global/globalComponents";

class Diagram extends React.Component {
  handleClick = () => {
    this.props.resetComponents();
    this.props.resetMeta();
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
            title={this.props.user.diagrams[this.props.index].title}
            diagramsOwned={this.props.user.diagramsOwned}
            diagramLimit={diagramLimit}
          />
        </td>
      </tr>
    );
  }
}

const SimpleMenu = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
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
    setShowConfirmCancel(true);
  };

  const deleteConfirmed = () => {
    deletediagram(props.id, cancelToken.current)
      .then((res) => {
        getProfile(cancelToken.current);
      })
      .catch(() => {});
    setShowConfirmCancel(false);
  };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {showConfirmCancel && (
        <ConfirmCancelAction
          header="Delete Diagram"
          text={"Are you sure you want to delete " + props.title + "?"}
          confirmFunc={deleteConfirmed}
          cancelFunc={() => setShowConfirmCancel(false)}
        />
      )}
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
  resetComponents,
  resetMeta,
};

export default connect(mapStateToProps, mapDispatchToProps)(Diagram);
