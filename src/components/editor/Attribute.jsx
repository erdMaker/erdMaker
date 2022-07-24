import { useState } from "react";
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
const pixelWidth = require("string-pixel-width");

const Attribute = (props) => {
  const [initialPosition, setInitialPosition] = useState({ x: props.x, y: props.y });

  // Does not let the attribute to be dragged out of stage bounds
  const stageBound = (pos) => {
    let newX;
    let newY;
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

  let nameText = props.name;
  const namePixelWidth = pixelWidth(nameText, {
    font: "Arial",
    size: fontSize,
  });

  if (props.type.composite) nameText = "(" + nameText + ")";

  const multivaluedEllipse = props.type.multivalued ? (
    <Ellipse
      radiusX={attributeRadiusX - multivaluedAttributeOffset}
      radiusY={attributeRadiusY - multivaluedAttributeOffset}
      fill="#ff9b8e"
      dash={props.type.derived ? [10, 3] : false}
      stroke={props.id === props.selector.current.id && props.selector.current.type === "attribute" ? "red" : "black"}
      strokeWidth={2}
    />
  ) : null;

  // Implementation of dashed text underline
  const textRows = Math.ceil(namePixelWidth / attributeTextWidth);
  const dashedUnderlineList = [];
  const parent = getComponentById(props.parentId);
  if (parent) {
    if (props.type.unique && parent.type === "weak") {
      if (textRows < 4) {
        for (let i = 0; i < textRows; i++) {
          const lineOffset =
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
      x={props.x}
      y={props.y}
      draggable
      onDragStart={(e) => {
        setInitialPosition({ x: e.target.x(), y: e.target.y() });
      }}
      onDragMove={(e) => {
        props.updatePositionAttribute({
          id: props.id,
          parentId: props.parentId,
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
          type: "attribute",
          id: props.id,
          parentId: props.parentId,
        });
      }}
      onClick={() => {
        props.deselect();
        props.select({
          type: "attribute",
          id: props.id,
          parentId: props.parentId,
        });
      }}
      dragBoundFunc={(pos) => stageBound(pos)}
    >
      <Ellipse
        radiusX={attributeRadiusX}
        radiusY={attributeRadiusY}
        fill="#ff9b8e"
        dash={props.type.derived ? [10, 3] : false}
        stroke={props.id === props.selector.current.id && props.selector.current.type === "attribute" ? "red" : "black"}
        strokeWidth={2}
      />
      {multivaluedEllipse}
      <Text
        text={nameText}
        fontSize={fontSize}
        textDecoration={props.type.unique ? "underline" : ""}
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
};

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
