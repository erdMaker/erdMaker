import React from "react";
import { connect } from "react-redux";
import { updatePositionAttribute, updatePositionChildren, repositionComponents, select } from "../../actions/actions";
import { Group, Ellipse, Text } from "react-konva";
import { stageWidth, stageHeight, attributeRadiusX, attributeRadiusY, multivaluedAttributeOffset, fontSize } from "../../global/constants";
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
    if (this.props.type.composite) nameText = "( " + nameText + " )";

    var nameYOffset;
    if (namePixelWidth < attributeRadiusX * 2) nameYOffset = -fontSize / 2;
    else if (namePixelWidth < attributeRadiusX * 4) nameYOffset = -fontSize;
    else nameYOffset = (-fontSize * 3) / 2;

    var optionalText = this.props.type.optional ? (
      <Text
        text="( O )"
        fontSize={fontSize}
        x={
          -pixelWidth("( O )", {
            font: "Arial",
            size: fontSize,
          }) / 2
        }
        y={fontSize / 2}
      />
    ) : null;

    var multivaluedEllipse = this.props.type.multivalued ? (
      <Ellipse
        radiusX={attributeRadiusX - multivaluedAttributeOffset}
        radiusY={attributeRadiusY - multivaluedAttributeOffset}
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
          radiusX={attributeRadiusX}
          radiusY={attributeRadiusY}
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
          fontSize={fontSize}
          textDecoration={this.props.type.unique ? "underline" : ""}
          width={attributeRadiusX * 2}
          //offsetX={namePixelWidth < attributeRadiusX * 2 ?
          //  (namePixelWidth / 2) :
          //  attributeRadiusX}
          x={namePixelWidth < attributeRadiusX * 2 ? -namePixelWidth / 2 : -attributeRadiusX}
          y={nameYOffset}
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
