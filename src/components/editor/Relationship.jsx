import React from "react";
import { connect } from "react-redux";
import {
  updatePositionRelationship,
  updatePositionChildren,
  repositionComponents,
  select,
} from "../../actions/actions";
import { Group, Line, Text } from "react-konva";
import {
  stageWidth,
  stageHeight,
  relationshipWidth,
  relationshipHeight,
  weakRelationshipOffset,
  fontSize,
} from "../../global/constants";
var pixelWidth = require("string-pixel-width");

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
        fill="white"
        stroke={
          this.props.id === this.props.selector.current.id && this.props.selector.current.type === "relationship"
            ? "red"
            : "black"
        }
        strokeWidth={2}
        closed="true"
        points={[
          0,
          -relationshipHeight + weakRelationshipOffset, // TOP
          relationshipWidth - 2 * weakRelationshipOffset,
          0, // RIGHT
          0,
          relationshipHeight - weakRelationshipOffset, // BOTTOM
          -relationshipWidth + 2 * weakRelationshipOffset,
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
          this.props.select({
            type: "relationship",
            id: this.props.id,
            parentId: null,
          });
        }}
        onClick={() => {
          this.props.select({
            type: "relationship",
            id: this.props.id,
            parentId: null,
          });
        }}
        dragBoundFunc={(pos) => this.stageBound(pos)}
      >
        <Line
          fill="white"
          stroke={
            this.props.id === this.props.selector.current.id && this.props.selector.current.type === "relationship"
              ? "red"
              : "black"
          }
          strokeWidth={2}
          closed="true"
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
          x={
            -pixelWidth(this.props.name, {
              font: "Arial",
              size: fontSize,
            }) / 2
          }
          y={-fontSize / 2}
        />
      </Group>
    );
  }
}

const mapStateToProps = (state) => ({
  selector: state.selector,
  stager: state.stager,
});

const mapDispatchToProps = {
  updatePositionRelationship,
  updatePositionChildren,
  repositionComponents,
  select,
};

export default connect(mapStateToProps, mapDispatchToProps)(Relationship);
