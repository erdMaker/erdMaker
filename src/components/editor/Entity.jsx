import { Component } from "react";
import { connect } from "react-redux";
import {
  updatePositionEntity,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
} from "../../actions/actions";
import { Group, Rect, Line, Text } from "react-konva";
import {
  stageWidth,
  stageHeight,
  entityWidth,
  entityHeight,
  entityTextWidth,
  entityWeakOffset,
  fontSize,
  textHeight,
  dragBoundOffset,
} from "../../global/constants";

class Entity extends Component {
  state = { initialPosition: { x: this.props.x, y: this.props.y } };

  // Does not let the entity to be dragged out of stage bounds
  stageBound = (pos) => {
    var newX;
    var newY;

    if (pos.x > stageWidth / 2)
      newX =
        pos.x > stageWidth - entityWidth / 2 - dragBoundOffset ? stageWidth - entityWidth / 2 - dragBoundOffset : pos.x;
    else newX = pos.x < entityWidth / 2 + dragBoundOffset ? entityWidth / 2 + dragBoundOffset : pos.x;

    if (pos.y > stageHeight / 2)
      newY =
        pos.y > stageHeight - entityHeight / 2 - dragBoundOffset
          ? stageHeight - entityHeight / 2 - dragBoundOffset
          : pos.y;
    else newY = pos.y < entityHeight / 2 + dragBoundOffset ? entityHeight / 2 + dragBoundOffset : pos.y;

    return {
      x: newX,
      y: newY,
    };
  };

  render() {
    var weakRect =
      this.props.type === "weak" ? (
        <Rect
          x={-entityWidth / 2 + entityWeakOffset / 2}
          y={-entityHeight / 2 + entityWeakOffset / 2}
          width={entityWidth - entityWeakOffset}
          height={entityHeight - entityWeakOffset}
          fill="#ffdd91"
          stroke={
            this.props.id === this.props.selector.current.id && this.props.selector.current.type === "entity"
              ? "red"
              : "black"
          }
          strokeWidth={2}
        />
      ) : null;

    var associativeDiamond =
      this.props.type === "associative" ? (
        <Line
          fill="#ffdd91"
          stroke={
            this.props.id === this.props.selector.current.id && this.props.selector.current.type === "entity"
              ? "red"
              : "black"
          }
          strokeWidth={2}
          lineJoin="bevel"
          closed
          points={[
            0,
            -entityHeight / 2, // TOP
            entityWidth / 2,
            0, // RIGHT
            0,
            entityHeight / 2, // BOTTOM
            -entityWidth / 2,
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
          this.props.updatePositionEntity({
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
            type: "entity",
            id: this.props.id,
            parentId: null,
          });
        }}
        onClick={() => {
          this.props.deselect();
          this.props.select({
            type: "entity",
            id: this.props.id,
            parentId: null,
          });
        }}
        dragBoundFunc={(pos) => this.stageBound(pos)}
      >
        <Rect
          x={-entityWidth / 2}
          y={-entityHeight / 2}
          width={entityWidth}
          height={entityHeight}
          fill="#ffdd91"
          stroke={
            this.props.id === this.props.selector.current.id && this.props.selector.current.type === "entity"
              ? "red"
              : "black"
          }
          strokeWidth={2}
        />
        {weakRect}
        {associativeDiamond}
        <Text
          text={this.props.name}
          fontSize={fontSize}
          align="center"
          verticalAlign="middle"
          width={entityTextWidth}
          height={textHeight}
          offsetX={entityTextWidth / 2}
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
  updatePositionEntity,
  updatePositionChildren,
  repositionComponents,
  select,
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Entity);
