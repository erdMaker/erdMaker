import React from "react";
import { connect } from "react-redux";
import {
  updatePositionRelationship,
  updatePositionChildren,
  repositionComponents,
  select,
} from "../../actions/actions";
import { Group, Line, Text } from "react-konva";
var pixelWidth = require("string-pixel-width");

class Relationship extends React.Component {
  constructor(props) {
    super(props);
    this.state = { initialPosition: { x: this.props.x, y: this.props.y } };
  }

  // Does not let the relationship to be dragged out of stage bounds
  stageBound = (pos) => {
    var newX;
    var newY;

    if (pos.x > this.props.stager.stageWidth / 2)
      newX =
        pos.x > this.props.stager.stageWidth - this.props.stager.relationshipWidth
          ? this.props.stager.stageWidth - this.props.stager.relationshipWidth
          : pos.x;
    else newX = pos.x < this.props.stager.relationshipWidth ? this.props.stager.relationshipWidth : pos.x;

    if (pos.y > this.props.stager.stageHeight / 2)
      newY =
        pos.y > this.props.stager.stageHeight - this.props.stager.relationshipHeight
          ? this.props.stager.stageHeight - this.props.stager.relationshipHeight
          : pos.y;
    else newY = pos.y < this.props.stager.relationshipHeight ? this.props.stager.relationshipHeight : pos.y;

    return {
      x: newX,
      y: newY,
    };
  };

  render() {
    var identifyingRelationshipRhombus = this.props.type.identifying ? (
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
          -this.props.stager.relationshipHeight + this.props.stager.identifyingRelationshipOffset, // TOP
          this.props.stager.relationshipWidth - 2 * this.props.stager.identifyingRelationshipOffset,
          0, // RIGHT
          0,
          this.props.stager.relationshipHeight - this.props.stager.identifyingRelationshipOffset, // BOTTOM
          -this.props.stager.relationshipWidth + 2 * this.props.stager.identifyingRelationshipOffset,
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
            -this.props.stager.relationshipHeight, // TOP
            this.props.stager.relationshipWidth,
            0, // RIGHT
            0,
            this.props.stager.relationshipHeight, // BOTTOM
            -this.props.stager.relationshipWidth,
            0, // LEFT
          ]}
        />
        {identifyingRelationshipRhombus}
        <Text
          text={this.props.name}
          fontSize={this.props.stager.fontSize}
          x={
            -pixelWidth(this.props.name, {
              font: "Arial",
              size: this.props.stager.fontSize,
            }) / 2
          }
          y={-this.props.stager.fontSize / 2}
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
