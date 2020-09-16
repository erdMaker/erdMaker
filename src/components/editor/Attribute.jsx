import React from "react";
import { connect } from "react-redux";
import { updatePositionAttribute, updatePositionChildren, repositionComponents, select } from "../../actions/actions";
import { Group, Ellipse, Text } from "react-konva";
var pixelWidth = require("string-pixel-width");

class Attribute extends React.Component {
  constructor(props) {
    super(props);
    this.state = { initialPosition: { x: this.props.x, y: this.props.y } };
  }

  stageBound = (pos) => {
    var newX;
    var newY;

    if (pos.x > this.props.stager.stageWidth / 2)
      newX =
        pos.x > this.props.stager.stageWidth - this.props.stager.attributeRadiusX
          ? this.props.stager.stageWidth - this.props.stager.attributeRadiusX
          : pos.x;
    else newX = pos.x < this.props.stager.attributeRadiusX ? this.props.stager.attributeRadiusX : pos.x;

    if (pos.y > this.props.stager.stageHeight / 2)
      newY =
        pos.y > this.props.stager.stageHeight - this.props.stager.attributeRadiusY
          ? this.props.stager.stageHeight - this.props.stager.attributeRadiusY
          : pos.y;
    else newY = pos.y < this.props.stager.attributeRadiusY ? this.props.stager.attributeRadiusY : pos.y;

    return {
      x: newX,
      y: newY,
    };
  };

  render() {
    var nameText = this.props.name;
    if (this.props.type.composite) nameText = "( " + nameText + " )";

    var optionalText = this.props.type.optional ? (
      <Text
        text="( O )"
        fontSize={this.props.stager.fontSize}
        x={
          -pixelWidth("( O )", {
            font: "Arial",
            size: this.props.stager.fontSize,
          }) / 2
        }
        y={this.props.stager.fontSize / 2}
      />
    ) : null;

    var multivaluedEllipse = this.props.type.multivalued ? (
      <Ellipse
        radiusX={this.props.stager.attributeRadiusX - this.props.stager.multivaluedAttributeOffset}
        radiusY={this.props.stager.attributeRadiusY - this.props.stager.multivaluedAttributeOffset}
        fill="white"
        dash={this.props.type.derived ? [10, 3] : false}
        stroke={
          this.props.id === this.props.selector.current.id && this.props.selector.current.type === "attribute"
            ? "red"
            : "black"
        }
        strokeWidth={2}
      />
    ) : null;

    return (
      <Group
        x={this.props.x}
        y={this.props.y}
        draggable
        onDragStart={(e) => {
          this.setState({
            initialPosition: { x: e.target.x(), y: e.target.y() },
          });
        }}
        onDragMove={(e) => {
          this.props.updatePositionAttribute({
            id: this.props.id,
            parentId: this.props.parentId,
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
            type: "attribute",
            id: this.props.id,
            parentId: this.props.parentId,
          });
        }}
        onClick={() => {
          this.props.select({
            type: "attribute",
            id: this.props.id,
            parentId: this.props.parentId,
          });
        }}
        dragBoundFunc={(pos) => this.stageBound(pos)}
      >
        <Ellipse
          radiusX={this.props.stager.attributeRadiusX}
          radiusY={this.props.stager.attributeRadiusY}
          fill="white"
          dash={this.props.type.derived ? [10, 3] : false}
          stroke={
            this.props.id === this.props.selector.current.id && this.props.selector.current.type === "attribute"
              ? "red"
              : "black"
          }
          strokeWidth={2}
        />
        {multivaluedEllipse}
        <Text
          text={nameText}
          fontSize={this.props.stager.fontSize}
          textDecoration={this.props.type.unique ? "underline" : ""}
          x={
            -pixelWidth(nameText, {
              font: "Arial",
              size: this.props.stager.fontSize,
            }) / 2
          }
          y={-this.props.stager.fontSize / 2}
        />
        {optionalText}
      </Group>
    );
  }
}

const mapStateToProps = (state) => ({
  selector: state.selector,
  stager: state.stager,
});

const mapDispatchToProps = {
  updatePositionAttribute,
  updatePositionChildren,
  repositionComponents,
  select,
};

export default connect(mapStateToProps, mapDispatchToProps)(Attribute);
