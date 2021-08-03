import { useState } from "react";
import { connect } from "react-redux";
import { updatePositionLabel, resizeLabel, select, repositionComponents } from "../../actions/actions";
import { Group, Rect, Line, Text } from "react-konva";
import { stageWidth, stageHeight, resizeRectSize, fontSize, dragBoundOffset } from "../../global/constants";

const Label = (props) => {
  const [showResizeRect, setShowResizeRect] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [initialWidth, setInitialWidth] = useState(props.width);
  const [initialHeight, setInitialHeight] = useState(props.height);
  const [initialMousePosition, setInitialMousePosition] = useState({});

  const resize = (e) => {
    const widthChange = e.target.getStage().getPointerPosition().x - initialMousePosition.x;
    const heightChange = e.target.getStage().getPointerPosition().y - initialMousePosition.y;
    const newWidth = initialWidth + 2 * widthChange;
    const newHeight = initialHeight + 2 * heightChange;
    props.resizeLabel({
      id: props.id,
      width: newWidth,
      height: newHeight,
    });
  };

  // Does not let the label to be dragged out of stage bounds
  const stageBound = (pos) => {
    let newX;
    let newY;
    if (pos.x > stageWidth / 2)
      newX =
        pos.x > stageWidth - props.width / 2 - dragBoundOffset ? stageWidth - props.width / 2 - dragBoundOffset : pos.x;
    else newX = pos.x < props.width / 2 + dragBoundOffset ? props.width / 2 + dragBoundOffset : pos.x;
    if (pos.y > stageHeight / 2)
      newY =
        pos.y > stageHeight - props.height / 2 - dragBoundOffset
          ? stageHeight - props.height / 2 - dragBoundOffset
          : pos.y;
    else newY = pos.y < props.height / 2 + dragBoundOffset ? props.height / 2 + dragBoundOffset : pos.y;
    return {
      x: newX,
      y: newY,
    };
  };

  // Invisible rectangle that is rendered on the mouse pointer when we resize the label
  // It helps to maintain the click and drag event even when the mouse pointer exits the red area
  // Uncomment fill and opacity below to see its effect
  const resizeRect = (
    <Rect
      x={-resizeRectSize / 2 + props.x + props.width / 2}
      y={-resizeRectSize / 2 + props.y + props.height / 2}
      width={resizeRectSize}
      height={resizeRectSize}
      visible={showResizeRect}
      //fill="yellow"  // Uncomment these to see the functionality of this component
      //opacity={0.5}
      onTouchMove={(e) => {
        if (isDragging) resize(e);
      }}
      onMouseMove={(e) => {
        if (isDragging) resize(e);
      }}
      onTouchEnd={() => {
        setIsDragging(false);
        setShowResizeRect(false);
        setInitialWidth(props.width);
        setInitialHeight(props.height);
      }}
      onMouseUp={() => {
        setIsDragging(false);
        setShowResizeRect(false);
        setInitialWidth(props.width);
        setInitialHeight(props.height);
      }}
      onMouseLeave={() => {
        setIsDragging(false);
        setShowResizeRect(false);
        setInitialWidth(props.width);
        setInitialHeight(props.height);
      }}
    />
  );

  return (
    <Group>
      <Group
        x={props.x}
        y={props.y}
        draggable
        onDragMove={(e) => {
          props.updatePositionLabel({
            id: props.id,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onDragEnd={() => props.repositionComponents()}
        onTap={() => {
          props.select({
            type: "label",
            id: props.id,
            parentId: null,
          });
        }}
        onClick={() => {
          props.select({
            type: "label",
            id: props.id,
            parentId: null,
          });
        }}
        dragBoundFunc={(pos) => stageBound(pos)}
      >
        <Rect
          x={-props.width / 2}
          y={-props.height / 2}
          width={props.width}
          height={props.height}
          fill="white"
          visible={props.selector.current.id === props.id ? true : false}
          stroke={props.id === props.selector.current.id && props.selector.current.type === "label" ? "red" : "black"}
          strokeWidth={2}
        />
        <Text
          text={props.text}
          fontSize={fontSize + 3}
          fontStyle="bold"
          width={props.width}
          height={props.height}
          x={-props.width / 2}
          y={-props.height / 2}
        />
      </Group>
      <Line
        fill="red"
        stroke="red"
        strokeWidth={1}
        visible={props.selector.current.id === props.id ? true : false}
        closed
        points={[
          props.x + props.width / 2,
          props.y + props.height / 2, // CORNER
          props.x + props.width / 2,
          props.y + props.height / 2 - 30, // RIGHT
          props.x + props.width / 2 - 30,
          props.y + props.height / 2, // BOTTOM
        ]}
        onTouchStart={(e) => {
          if (!isDragging) {
            setIsDragging(true);
            setShowResizeRect(true);
            setInitialMousePosition(e.target.getStage().getPointerPosition());
          }
        }}
        onMouseDown={(e) => {
          if (!isDragging) {
            setIsDragging(true);
            setShowResizeRect(true);
            setInitialMousePosition(e.target.getStage().getPointerPosition());
          }
        }}
      />
      {resizeRect}
    </Group>
  );
};

const mapStateToProps = (state) => ({
  selector: state.selector,
});

const mapDispatchToProps = {
  select,
  resizeLabel,
  updatePositionLabel,
  repositionComponents,
};

export default connect(mapStateToProps, mapDispatchToProps)(Label);
