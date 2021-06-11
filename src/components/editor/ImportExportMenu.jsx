import { useEffect, useRef } from "react";
import * as React from "react";
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
import { makeCompatible } from "../../global/globalFuncs";
import axios from "axios";
import {
  stageWidth,
  stageHeight,
  entityWidth,
  entityHeight,
  relationshipWidth,
  relationshipHeight,
  attributeRadiusX,
  attributeRadiusY,
  extensionRadius,
  dragBoundOffset,
} from "../../global/constants";
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
  var fileName = props.meta.title ? props.meta.title : "diagram";

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
          let data = makeCompatible(res.data);
          props.setMeta(data.meta);
          props.setComponents(data.components);
          props.repositionComponents();
        }
      })
      .catch(() => {});
  };

  // Runs when user clicks to select file for import
  const importDiagram = (e) => {
    // Return if nothing or multiple files are selected
    if (!e || !e.target || !e.target.files || !(e.target.files.length === 1)) {
      return;
    }

    var file = e.target.files[0];
    const name = file.name;
    const lastDot = name.lastIndexOf(".");

    // Get filename and extension of selected file
    //const fileName = name.substring(0, lastDot);
    const ext = name.substring(lastDot + 1);

    if (ext !== "erdm") return;

    var fr = new FileReader();
    fr.onloadend = handleServerImport;
    fr.readAsText(file);

    e.target.value = null; // Reset the file browser
  };

  const exportDiagram = () => {
    exportdiagram(cancelToken.current)
      .then((res) => {
        if (res && res.status === 200) {
          fileDownload(res.data.token, fileName + ".erdm");
        }
      })
      .catch(() => {});
  };

  // Calculate the rectangle area occupied by the rendered elements on the stage
  const getStageUsedArea = () => {
    var edges = [
      stageWidth, // leftMost x
      stageHeight, // topMost y
      0, // rightMost x
      0, // bottomMost y
    ];
    for (let entity of props.components.entities) {
      if (entity.x - entityWidth / 2 < edges[0]) edges[0] = entity.x - entityWidth / 2;
      if (entity.y - entityHeight / 2 < edges[1]) edges[1] = entity.y - entityHeight / 2;
      if (entity.x + entityWidth / 2 > edges[2]) edges[2] = entity.x + entityWidth / 2;
      if (entity.y + entityHeight / 2 > edges[3]) edges[3] = entity.y + entityHeight / 2;
    }
    for (let relationship of props.components.relationships) {
      if (relationship.x - relationshipWidth < edges[0]) edges[0] = relationship.x - relationshipWidth;
      if (relationship.y - relationshipHeight < edges[1]) edges[1] = relationship.y - relationshipHeight;
      if (relationship.x + relationshipWidth > edges[2]) edges[2] = relationship.x + relationshipWidth;
      if (relationship.y + relationshipHeight > edges[3]) edges[3] = relationship.y + relationshipHeight;
    }
    for (let attribute of props.components.attributes) {
      if (attribute.x - attributeRadiusX < edges[0]) edges[0] = attribute.x - attributeRadiusX;
      if (attribute.y - attributeRadiusY < edges[1]) edges[1] = attribute.y - attributeRadiusY;
      if (attribute.x + attributeRadiusX > edges[2]) edges[2] = attribute.x + attributeRadiusX;
      if (attribute.y + attributeRadiusY > edges[3]) edges[3] = attribute.y + attributeRadiusY;
    }
    for (let extension of props.components.extensions) {
      if (extension.x - extensionRadius < edges[0]) edges[0] = extension.x - extensionRadius;
      if (extension.y - extensionRadius < edges[1]) edges[1] = extension.y - extensionRadius;
      if (extension.x + extensionRadius > edges[2]) edges[2] = extension.x + extensionRadius;
      if (extension.y + extensionRadius > edges[3]) edges[3] = extension.y + extensionRadius;
    }
    for (let label of props.components.labels) {
      if (label.x - label.width / 2 < edges[0]) edges[0] = label.x - label.width / 2;
      if (label.y - label.height / 2 < edges[1]) edges[1] = label.y - label.height / 2;
      if (label.x + label.width / 2 > edges[2]) edges[2] = label.x + label.width / 2;
      if (label.y + label.height / 2 > edges[3]) edges[3] = label.y + label.height / 2;
    }
    return edges;
  };

  const exportImage = () => {
    var edges = getStageUsedArea();

    var canvas = document.getElementsByTagName("CANVAS")[0];

    //Make a Canvas to copy the data you would like to download to
    var hidden_canvas = document.createElement("canvas");
    hidden_canvas.style.display = "none";
    document.body.appendChild(hidden_canvas);
    var hiddenCanvasScaling = window.devicePixelRatio;
    hidden_canvas.width = (edges[2] - edges[0]) * hiddenCanvasScaling + 2 * dragBoundOffset; // Multiplying by 1.25 because it seems there is internal
    hidden_canvas.height = (edges[3] - edges[1]) * hiddenCanvasScaling + 2 * dragBoundOffset; // scaling taking place. Found out by trial and error

    //Draw the data you want to download to the hidden canvas
    var hidden_ctx = hidden_canvas.getContext("2d");
    hidden_ctx.drawImage(
      canvas,
      edges[0] * hiddenCanvasScaling - dragBoundOffset, //Start Clipping
      edges[1] * hiddenCanvasScaling - dragBoundOffset, //Start Clipping
      hidden_canvas.width, //Clipping Width
      hidden_canvas.height, //Clipping Height
      0, //Place X
      0, //Place Y
      hidden_canvas.width, //Place Width
      hidden_canvas.height //Place Height
    );

    var downloadImg = document.getElementById("downloadImg");
    var img = hidden_canvas.toDataURL("image/jpg").replace("image/jpg", "image/octet-stream");
    downloadImg.setAttribute("href", img);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // Return focus to the button when we transitioned from !open -> open
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
                      <a className="undecorate-link" id="downloadImg" download={fileName + "_img.jpg"} href="...">
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

const mapStateToProps = (state) => ({
  components: state.components,
  meta: state.meta,
});

const mapDispatchToProps = {
  resetMeta,
  resetComponents,
  setComponents,
  repositionComponents,
  setMeta,
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImportExportMenuListComposition);
