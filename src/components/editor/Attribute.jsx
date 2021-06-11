import { Component } from "react";
import { connect } from "react-redux";
import {
  updatePositionAttribute,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
} from "../../actions/actions";
import { Group, Ellipse, Text, Line } from "react-konva";
import {
  stageWidth,
  stageHeight,
  attributeRadiusX,
  attributeRadiusY,
  attributeTextWidth,
  multivaluedAttributeOffset,
  fontSize,
  textHeight,
  dragBoundOffset,
} from "../../global/constants";
import { getComponentById } from "../../global/globalFuncs";
var pixelWidth = require("string-pixel-width");

class Attribute extends Component {
  state = { initialPosition: { x: this.props.x, y: this.props.y } };

  // Does not let the attribute to be dragged out of stage bounds
  stageBound = (pos) => {
    var newX;
    var newY;

    if (pos.x > stageWidth / 2)
      newX =
        pos.x > stageWidth - attributeRadiusX - dragBoundOffset
          ? stageWidth - attributeRadiusX - dragBoundOffset
          : pos.x;
    else newX = pos.x < attributeRadiusX + dragBoundOffset ? attributeRadiusX + dragBoundOffset : pos.x;

    if (pos.y > stageHeight / 2)
      newY =
        pos.y > stageHeight - attributeRadiusY - dragBoundOffset
          ? stageHeight - attributeRadiusY - dragBoundOffset
          : pos.y;
    else newY = pos.y < attributeRadiusY + dragBoundOffset ? attributeRadiusY + dragBoundOffset : pos.y;

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

    // Implementation of dashed text underline
    var textRows = Math.ceil(namePixelWidth / attributeTextWidth);
    var parent;
    if ((parent = getComponentById(this.props.parentId))) {
      if (this.props.type.unique && parent.type === "weak") {
        var dashedUnderlineList = [];
        if (textRows < 4) {
          for (let i = 0; i < textRows; i++) {
            let lineOffset =
              textRows % 2
                ? fontSize / 2 + 0.8 + i * fontSize - Math.floor(textRows / 2) * fontSize
                : fontSize / 2 + 0.8 + i * fontSize - (Math.floor(textRows / 2) * fontSize) / 2;
            dashedUnderlineList.push(
              <Line
                key={i}
                stroke="#ff9b8e"
                strokeWidth={2}
                dash={[3, 5]}
                points={[-attributeTextWidth / 2 + 5, lineOffset, attributeTextWidth / 2 - 5, lineOffset]}
              />
            );
          }
        }
      }
    }

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
          verticalAlign="middle"
          width={attributeTextWidth}
          height={textHeight}
          offsetX={attributeTextWidth / 2}
          offsetY={textHeight / 2}
          listening={false}
        />
        {dashedUnderlineList}
      </Group>
    );
  }
}

const mapStateToProps = (state) => ({
  selector: state.selector,
  components: state.components,
});

const mapDispatchToProps = {
  updatePositionAttribute,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Attribute);
