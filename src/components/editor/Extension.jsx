import { connect } from "react-redux";
import { updatePositionExtension, select, repositionComponents } from "../../actions/actions";
import { Group, Circle, Line, Text } from "react-konva";
import { stageWidth, stageHeight, extensionRadius, fontSize, dragBoundOffset } from "../../global/constants";
const pixelWidth = require("string-pixel-width");

const Extension = (props) => {
  // Does not let the extension to be dragged out of stage bounds
  const stageBound = (pos) => {
    let newX;
    let newY;
    if (pos.x > stageWidth / 2)
      newX =
        pos.x > stageWidth - extensionRadius - dragBoundOffset ? stageWidth - extensionRadius - dragBoundOffset : pos.x;
    else newX = pos.x < extensionRadius + dragBoundOffset ? extensionRadius + dragBoundOffset : pos.x;
    if (pos.y > stageHeight / 2)
      newY =
        pos.y > stageHeight - extensionRadius - dragBoundOffset
          ? stageHeight - extensionRadius - dragBoundOffset
          : pos.y;
    else newY = pos.y < extensionRadius + dragBoundOffset ? extensionRadius + dragBoundOffset : pos.y;
    return {
      x: newX,
      y: newY,
    };
  };

  let text;
  if (props.type === "specialize")
    if (props.cardinality === "disjoint") text = "d";
    else if (props.cardinality === "overlap") text = "o";
    else text = "";
  else if (props.type === "union") text = "U";

  const textPixelWidth = pixelWidth(text, {
    font: "Arial",
    size: fontSize,
  });

  return (
    <Group
      x={props.x}
      y={props.y}
      draggable
      dragBoundFunc={(pos) => stageBound(pos)}
      onDragMove={(e) => {
        props.updatePositionExtension({
          id: props.id,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
      onDragEnd={() => props.repositionComponents()}
      onTap={() => {
        props.select({
          type: "extension",
          id: props.id,
          parentId: props.parentId,
        });
      }}
      onClick={() => {
        props.select({
          type: "extension",
          id: props.id,
          parentId: props.parentId,
        });
      }}
    >
      <Circle
        radius={extensionRadius}
        fill="white"
        stroke={props.id === props.selector.current.id && props.selector.current.type === "extension" ? "red" : "black"}
        strokeWidth={2}
      />
      <Text text={text} fontSize={fontSize} fontStyle="bold" x={-textPixelWidth / 2} y={-fontSize / 2} />
    </Group>
  );
};

// The small curvy line connecting extensions and their children
export const ExtensionSpline = (props) => {
  return (
    <Line
      x={props.x}
      y={props.y}
      rotation={props.angle}
      stroke={"black"}
      strokeWidth={2}
      tension={0.5}
      points={[-15, -5, 0, 0, 15, -5]}
    />
  );
};

const mapStateToProps = (state) => ({
  selector: state.selector,
});

const mapDispatchToProps = {
  updatePositionExtension,
  select,
  repositionComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(Extension);
