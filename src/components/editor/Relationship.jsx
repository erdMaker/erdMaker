import React from "react";
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
} from "../../global/constants";

class Relationship extends React.Component {
  state = { initialPosition: { x: this.props.x, y: this.props.y } };

  // Does not let the relationship to be dragged out of stage bounds
  stageBound = (pos) => {
    var newX;
    var newY;

    if (pos.x > stageWidth / 2) newX = pos.x > stageWidth - relationshipWidth ? stageWidth - relationshipWidth : pos.x;
    else newX = pos.x < relationshipWidth ? relationshipWidth : pos.x;

    if (pos.y > stageHeight / 2)
      newY = pos.y > stageHeight - relationshipHeight ? stageHeight - relationshipHeight : pos.y;
    else newY = pos.y < relationshipHeight ? relationshipHeight : pos.y;

    return {
      x: newX,
      y: newY,
    };
  };

  render() {
    var weakRelationshipRhombus = this.props.type.weak ? (
      <Line
        fill="#94dfea"
        stroke={
          this.props.id === this.props.selector.current.id && this.props.selector.current.type === "relationship"
            ? "red"
            : "black"
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
        x={this.props.x}
        y={this.props.y}
        draggable
        onDragMove={(e) => {
          this.props.updatePositionRelationship({
            id: this.props.id,
            x: e.target.x(),
            y: e.target.y(),
          });
          this.props.updatePositionChildren({
            id: this.props.id,
            dx: e.target.x() - this.state.initialPosition.x,
            dy: e.target.y() - this.state.initialPosition.y,
          });
          this.setState({
            initialPosition: { x: e.target.x(), y: e.target.y() },
          });
        }}
        onDragEnd={() => this.props.repositionComponents()}
        onTap={() => {
          this.props.deselect();
          this.props.select({
            type: "relationship",
            id: this.props.id,
            parentId: null,
          });
        }}
        onClick={() => {
          this.props.deselect();
          this.props.select({
            type: "relationship",
            id: this.props.id,
            parentId: null,
          });
        }}
        dragBoundFunc={(pos) => this.stageBound(pos)}
      >
        <Line
          fill="#94dfea"
          stroke={
            this.props.id === this.props.selector.current.id && this.props.selector.current.type === "relationship"
              ? "red"
              : "black"
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
          text={this.props.name}
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
  }
}

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
