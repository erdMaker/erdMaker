import { Component, useState, useEffect, useRef } from "react";
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

class Diagram extends Component {
  handleClick = () => {
    this.props.resetComponents();
    this.props.resetMeta();
    this.props.setActiveDiagram(this.props.diagram.id);
  };

  // Calculates how much time has passed since each diagram got updated
  calculateLastUpdate = () => {
    let lastUpdate;
    const updatedAt = this.props.diagram.updatedAt;
    const newUpdatedAt = Date.parse(updatedAt);
    const currServerTime = Date.parse(this.props.general.serverTime);
    const difference = currServerTime - newUpdatedAt;
    const inDays = difference / 86400000;
    const inHours = difference / 3600000;
    const inMinutes = difference / 60000;
    const inSeconds = difference / 1000;
    if (inDays >= 1) lastUpdate = Math.floor(inDays) + " day(s) ago";
    else if (inHours >= 1) lastUpdate = Math.floor(inHours) + " hour(s) ago";
    else if (inMinutes >= 1) lastUpdate = Math.floor(inMinutes) + " minute(s) ago";
    else lastUpdate = Math.floor(inSeconds) + " second(s) ago";
    return lastUpdate;
  };

  render() {
    const lastUpdate = this.calculateLastUpdate();
    return (
      <tr>
        <td>
          <Link className="title-link" to="/editor" onClick={this.handleClick}>
            {this.props.diagram.title}
          </Link>
        </td>
        <td>
          <img className="edit-icon" src={editImg} alt=":(" /> {lastUpdate}
        </td>
        <td>
          <SimpleMenu
            id={this.props.diagram.id}
            title={this.props.diagram.title}
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

  const handleDuplicate = async () => {
    try {
      await duplicatediagram(props.id, cancelToken.current);
      getProfile(cancelToken.current);
    } catch (e) {}
  };

  const handleDelete = () => {
    setShowConfirmCancel(true);
  };

  const deleteConfirmed = async () => {
    try {
      await deletediagram(props.id, cancelToken.current);
      getProfile(cancelToken.current);
    } catch (e) {}
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
          text={'Are you sure you want to delete "' + props.title + '"?'}
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
