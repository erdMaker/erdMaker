import React from "react";
import { connect } from "react-redux";
import { Group, Text, Label, Tag } from "react-konva";
var pixelWidth = require("string-pixel-width");

const SpecificValues = (props) => {
  var show = props.text === "(,)" ? false : true;
  return (
    <Group x={props.x} y={props.y} visible={show}>
      <Label
        x={
          -pixelWidth(props.text, {
            font: "Arial",
            size: props.stager.fontSize,
          }) / 2
        }
        y={-props.stager.fontSize / 2}
      >
        <Tag fill="white" />
        <Text text={props.text} fontSize={props.stager.fontSize} />
      </Label>
    </Group>
  );
};

const mapStateToProps = (state) => ({
  stager: state.stager,
});

export default connect(mapStateToProps, null)(SpecificValues);
