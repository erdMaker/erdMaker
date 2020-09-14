import React, { useEffect, useRef } from "react";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import { exportdiagram } from "../../global/diagramRequests";
import { connect } from "react-redux";
import {
  repositionComponents,
  resetMeta,
  resetComponents,
  setComponents,
  setMeta,
  deselect,
} from "../../actions/actions";
import { importdiagram } from "../../global/diagramRequests";
import axios from "axios";
var fileDownload = require("js-file-download");

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
}));

const ImportExportMenuListComposition = (props) => {
  const upload = useRef(null);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const cancelToken = useRef(null);

  useEffect(() => {
    cancelToken.current = axios.CancelToken.source();
    return () => {
      cancelToken.current.cancel("Request is being canceled");
    };
  }, []);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    //if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //  return;
    //}
    setOpen(false);
  };

  const handleServerImport = (e) => {
    importdiagram(e.target.result, cancelToken.current)
      .then((res) => {
        if (res && res.status === 200) {
          props.resetMeta();
          props.resetComponents();
          props.setMeta(res.data.meta);
          props.setComponents(res.data.components);
          props.repositionComponents();
        }
      })
      .catch(() => {});
  };

  const importDiagram = (e) => {
    if (!e || !e.target || !e.target.files || !(e.target.files.length === 1)) {
      return;
    }

    var file = e.target.files[0];
    const name = file.name;
    const lastDot = name.lastIndexOf(".");

    //const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    if (ext !== "erdm") return;

    var fr = new FileReader();
    fr.onloadend = handleServerImport;
    fr.readAsText(file);

    e.target.value = null;
  };

  const exportDiagram = () => {
    exportdiagram(cancelToken.current)
      .then((res) => {
        if (res && res.status === 200) {
          fileDownload(res.data.token, "diagram.erdm");
        }
      })
      .catch(() => {});
  };

  const exportImage = () => {
    var canvas = document.getElementsByTagName("CANVAS")[0];
    var downloadImg = document.getElementById("downloadImg");
    var img = canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
    downloadImg.setAttribute("href", img);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <>
        <button
          className="tools-button-blue"
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={() => {
            props.deselect();
            handleToggle();
          }}
        >
          Import / Export
        </button>
        <Popper
          className="import-export-popper"
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          //disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    <input
                      type="file"
                      ref={upload}
                      onChange={(e) => {
                        importDiagram(e);
                        handleClose();
                      }}
                      style={{ display: "none" }}
                    />
                    <MenuItem
                      type="button"
                      onClick={(e) => {
                        upload.current.click();
                      }}
                    >
                      Import...
                    </MenuItem>
                    <MenuItem
                      type="button"
                      onClick={() => {
                        exportDiagram();
                        handleClose();
                      }}
                    >
                      Export File
                    </MenuItem>
                    <MenuItem
                      type="button"
                      onClick={() => {
                        exportImage();
                        handleClose();
                      }}
                    >
                      <a className="undecorate-link" id="downloadImg" download="diagram.jpg" href="...">
                        Export Image
                      </a>
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    </div>
  );
};

const mapDispatchToProps = {
  resetMeta,
  resetComponents,
  setComponents,
  repositionComponents,
  setMeta,
  deselect,
};

export default connect(null, mapDispatchToProps)(ImportExportMenuListComposition);
