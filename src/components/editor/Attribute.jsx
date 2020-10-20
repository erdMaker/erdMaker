import React from "react";
import { connect } from "react-redux";
import {
  updatePositionAttribute,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
} from "../../actions/actions";
import { Group, Ellipse, Text } from "react-konva";
import {
  stageWidth,
  stageHeight,
  attributeRadiusX,
  attributeRadiusY,
  attributeTextWidth,
  multivaluedAttributeOffset,
  fontSize,
} from "../../global/constants";
var pixelWidth = require("string-pixel-width");

class Attribute extends React.Component {
  state = { initialPosition: { x: this.props.x, y: this.props.y } };

  // Does not let the attribute to be dragged out of stage bounds
  stageBound = (pos) => {
    var newX;
    var newY;

    if (pos.x > stageWidth / 2) newX = pos.x > stageWidth - attributeRadiusX ? stageWidth - attributeRadiusX : pos.x;
    else newX = pos.x < attributeRadiusX ? attributeRadiusX : pos.x;

    if (pos.y > stageHeight / 2) newY = pos.y > stageHeight - attributeRadiusY ? stageHeight - attributeRadiusY : pos.y;
    else newY = pos.y < attributeRadiusY ? attributeRadiusY : pos.y;

    return {
      x: newX,
      y: newY,
    };
  };

  render() {
    var nameText = this.props.name;
    var namePixelWidth = pixelWidth(nameText, {
      font: "Arial",
      size: fontSize,
    });

    if (this.props.type.optional) nameText = nameText + " (O)";

    if (this.props.type.composite) nameText = "(" + nameText + ")";

    var nameYOffset;
    if (namePixelWidth < attributeTextWidth) nameYOffset = fontSize / 2;
    else if (namePixelWidth < attributeTextWidth * 2) nameYOffset = fontSize;
    else if (namePixelWidth < attributeTextWidth * 3) nameYOffset = (fontSize * 3) / 2;
    else nameYOffset = fontSize * 2;

    var multivaluedEllipse = this.props.type.multivalued ? (
      <Ellipse
        radiusX={attributeRadiusX - multivaluedAttributeOffset}
        radiusY={attributeRadiusY - multivaluedAttributeOffset}
        fill="#ff9b8e"
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
          this.props.deselect();
          this.props.select({
            type: "attribute",
            id: this.props.id,
            parentId: this.props.parentId,
          });
        }}
        onClick={() => {
          this.props.deselect();
          this.props.select({
            type: "attribute",
            id: this.props.id,
            parentId: this.props.parentId,
          });
        }}
        dragBoundFunc={(pos) => this.stageBound(pos)}
      >
        <Ellipse
          radiusX={attributeRadiusX}
          radiusY={attributeRadiusY}
          fill="#ff9b8e"
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
          fontSize={fontSize}
          textDecoration={this.props.type.unique ? "underline" : ""}
          align="center"
          width={attributeTextWidth}
          offsetX={attributeTextWidth / 2}
          offsetY={nameYOffset}
        />
      </Group>
    );
  }
}

const mapStateToProps = (state) => ({
  selector: state.selector,
});

const mapDispatchToProps = {
  updatePositionAttribute,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Attribute);
