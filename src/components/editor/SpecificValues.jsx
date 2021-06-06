import { Group, Text, Label, Tag } from "react-konva";
import { fontSize } from "../../global/constants";
var pixelWidth = require("string-pixel-width");

const SpecificValues = (props) => {
  return (
    <Group x={props.x} y={props.y}>
      <Label
        offsetX={
          pixelWidth(props.text, {
            font: "Arial",
            size: fontSize,
          }) / 2
        }
        y={-fontSize / 2}
      >
        <Tag fill="white" />
        <Text text={props.text} fontSize={fontSize} />
      </Label>
    </Group>
  );
};

export default SpecificValues;
