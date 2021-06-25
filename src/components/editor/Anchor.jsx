import { Group, Line, Ellipse } from "react-konva";

const Anchor = (props) => {
  const mandatory =
    props.minimum === "one" ? (
      <Line
        stroke={"black"}
        strokeWidth={2}
        points={[
          -10,
          10, // LEFT
          10,
          10, // RIGHT
        ]}
      />
    ) : null;

  const optional =
    props.minimum === "zero" ? (
      <Ellipse y={10} radiusX={8} radiusY={4} fill="white" stroke={"black"} strokeWidth={2} />
    ) : null;

  const one =
    props.maximum === "one" ? (
      <Line
        stroke={"black"}
        strokeWidth={2}
        points={[
          -10,
          20, // LEFT
          10,
          20, // RIGHT
        ]}
      />
    ) : null;

  const many =
    props.maximum === "many" ? (
      <Group>
        <Line
          stroke={"black"}
          strokeWidth={2}
          points={[
            0,
            20, // TOP
            -10,
            30, // BOTTOM
          ]}
        />
        <Line
          stroke={"black"}
          strokeWidth={2}
          points={[
            0,
            20, // TOP
            10,
            30, // BOTTOM
          ]}
        />
      </Group>
    ) : null;

  return (
    <Group x={props.x} y={props.y} rotation={props.angle}>
      <Line
        stroke={"black"}
        strokeWidth={2}
        points={[
          0,
          0, // TOP
          0,
          30, // BOTTOM
        ]}
      />
      {mandatory}
      {optional}
      {one}
      {many}
    </Group>
  );
};

export default Anchor;
