import { useState } from "react";
import { connect } from "react-redux";
import {
  updatePositionEntity,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
} from "../../actions/actions";
import { Group, Rect, Line, Text } from "react-konva";
import {
  stageWidth,
  stageHeight,
  entityWidth,
  entityHeight,
  entityTextWidth,
  entityWeakOffset,
  fontSize,
  textHeight,
  dragBoundOffset,
} from "../../global/constants";

const Entity = (props) => {
  const [initialPosition, setInitialPosition] = useState({ x: props.x, y: props.y });

  // Does not let the entity to be dragged out of stage bounds
  const stageBound = (pos) => {
    let newX;
    let newY;
    if (pos.x > stageWidth / 2)
      newX =
        pos.x > stageWidth - entityWidth / 2 - dragBoundOffset ? stageWidth - entityWidth / 2 - dragBoundOffset : pos.x;
    else newX = pos.x < entityWidth / 2 + dragBoundOffset ? entityWidth / 2 + dragBoundOffset : pos.x;
    if (pos.y > stageHeight / 2)
      newY =
        pos.y > stageHeight - entityHeight / 2 - dragBoundOffset
          ? stageHeight - entityHeight / 2 - dragBoundOffset
          : pos.y;
    else newY = pos.y < entityHeight / 2 + dragBoundOffset ? entityHeight / 2 + dragBoundOffset : pos.y;
    return {
      x: newX,
      y: newY,
    };
  };

  const weakRect =
    props.type === "weak" ? (
      <Rect
        x={-entityWidth / 2 + entityWeakOffset / 2}
        y={-entityHeight / 2 + entityWeakOffset / 2}
        width={entityWidth - entityWeakOffset}
        height={entityHeight - entityWeakOffset}
        fill="#ffdd91"
        stroke={props.id === props.selector.current.id && props.selector.current.type === "entity" ? "red" : "black"}
        strokeWidth={2}
      />
    ) : null;

  const associativeDiamond =
    props.type === "associative" ? (
      <Line
        fill="#ffdd91"
        stroke={props.id === props.selector.current.id && props.selector.current.type === "entity" ? "red" : "black"}
        strokeWidth={2}
        lineJoin="bevel"
        closed
        points={[
          0,
          -entityHeight / 2, // TOP
          entityWidth / 2,
          0, // RIGHT
          0,
          entityHeight / 2, // BOTTOM
          -entityWidth / 2,
          0, // LEFT
        ]}
      />
    ) : null;

  return (
    <Group
      x={props.x}
      y={props.y}
      draggable
      onDragMove={(e) => {
        props.updatePositionEntity({
          id: props.id,
          x: e.target.x(),
          y: e.target.y(),
        });
        props.updatePositionChildren({
          id: props.id,
          dx: e.target.x() - initialPosition.x,
          dy: e.target.y() - initialPosition.y,
        });
        setInitialPosition({ x: e.target.x(), y: e.target.y() });
      }}
      onDragEnd={() => props.repositionComponents()}
      onTap={() => {
        props.deselect();
        props.select({
          type: "entity",
          id: props.id,
          parentId: null,
        });
      }}
      onClick={() => {
        props.deselect();
        props.select({
          type: "entity",
          id: props.id,
          parentId: null,
        });
      }}
      dragBoundFunc={(pos) => stageBound(pos)}
    >
      <Rect
        x={-entityWidth / 2}
        y={-entityHeight / 2}
        width={entityWidth}
        height={entityHeight}
        fill="#ffdd91"
        stroke={props.id === props.selector.current.id && props.selector.current.type === "entity" ? "red" : "black"}
        strokeWidth={2}
      />
      {weakRect}
      {associativeDiamond}
      <Text
        text={props.name}
        fontSize={fontSize}
        align="center"
        verticalAlign="middle"
        width={entityTextWidth}
        height={textHeight}
        offsetX={entityTextWidth / 2}
        offsetY={textHeight / 2}
        listening={false}
      />
    </Group>
  );
};

const mapStateToProps = (state) => ({
  selector: state.selector,
});

const mapDispatchToProps = {
  updatePositionEntity,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Entity);
