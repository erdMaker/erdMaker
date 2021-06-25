import { useState } from "react";
import { connect } from "react-redux";
import {
  updatePositionRelationship,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
} from "../../actions/actions";
import { Group, Line, Text } from "react-konva";
import {
  stageWidth,
  stageHeight,
  relationshipWidth,
  relationshipHeight,
  relationshipTextWidth,
  weakRelationshipOffset,
  fontSize,
  textHeight,
  dragBoundOffset,
} from "../../global/constants";

const Relationship = (props) => {
  const [initialPosition, setInitialPosition] = useState({ x: props.x, y: props.y });

  // Does not let the relationship to be dragged out of stage bounds
  const stageBound = (pos) => {
    let newX;
    let newY;
    if (pos.x > stageWidth / 2)
      newX =
        pos.x > stageWidth - relationshipWidth - dragBoundOffset
          ? stageWidth - relationshipWidth - dragBoundOffset
          : pos.x;
    else newX = pos.x < relationshipWidth + dragBoundOffset ? relationshipWidth + dragBoundOffset : pos.x;
    if (pos.y > stageHeight / 2)
      newY =
        pos.y > stageHeight - relationshipHeight - dragBoundOffset
          ? stageHeight - relationshipHeight - dragBoundOffset
          : pos.y;
    else newY = pos.y < relationshipHeight + dragBoundOffset ? relationshipHeight + dragBoundOffset : pos.y;
    return {
      x: newX,
      y: newY,
    };
  };

  const weakRelationshipRhombus = props.type.weak ? (
    <Line
      fill="#94dfea"
      stroke={
        props.id === props.selector.current.id && props.selector.current.type === "relationship" ? "red" : "black"
      }
      strokeWidth={2}
      lineJoin="bevel"
      closed
      points={[
        0,
        -relationshipHeight + weakRelationshipOffset, // TOP
        relationshipWidth - 1.5 * weakRelationshipOffset,
        0, // RIGHT
        0,
        relationshipHeight - weakRelationshipOffset, // BOTTOM
        -relationshipWidth + 1.5 * weakRelationshipOffset,
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
        props.updatePositionRelationship({
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
          type: "relationship",
          id: props.id,
          parentId: null,
        });
      }}
      onClick={() => {
        props.deselect();
        props.select({
          type: "relationship",
          id: props.id,
          parentId: null,
        });
      }}
      dragBoundFunc={(pos) => stageBound(pos)}
    >
      <Line
        fill="#94dfea"
        stroke={
          props.id === props.selector.current.id && props.selector.current.type === "relationship" ? "red" : "black"
        }
        strokeWidth={2}
        lineJoin="bevel"
        closed
        points={[
          0,
          -relationshipHeight, // TOP
          relationshipWidth,
          0, // RIGHT
          0,
          relationshipHeight, // BOTTOM
          -relationshipWidth,
          0, // LEFT
        ]}
      />
      {weakRelationshipRhombus}
      <Text
        text={props.name}
        fontSize={fontSize}
        align="center"
        verticalAlign="middle"
        width={relationshipTextWidth}
        height={textHeight}
        offsetX={relationshipTextWidth / 2}
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
  updatePositionRelationship,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Relationship);
