import { useRef } from "react";
import Entity from "./Entity";
import Relationship from "./Relationship";
import Attribute from "./Attribute";
import Extension from "./Extension";
import Label from "./Label";
import SpecificValues from "./SpecificValues";
import Anchor from "./Anchor";
import { ExtensionSpline } from "./Extension";
import { Stage, Layer, Line, Rect } from "react-konva";
import Properties from "./Properties";
import { Provider, ReactReduxContext, connect } from "react-redux";
import { deselect } from "../../actions/actions";
import { distance, minJsonArray } from "../../global/utils";
import { stageWidth, stageHeight, entityWidth, entityHeight, anchorLength } from "../../global/constants";
import { getComponentById } from "../../global/globalFuncs";

const Surface = (props) => {
  // DOM reference to the stage
  const stage = useRef(null);

  // Define the anchor points for entities
  const entityAnchors = [
    {
      x: -(entityWidth / 2) - anchorLength,
      y: 0,
      angle: -90,
    },
    {
      x: -(entityWidth / 3),
      y: -(entityHeight / 2) - anchorLength,
      angle: 0,
    },
    {
      x: 0,
      y: -(entityHeight / 2) - anchorLength,
      angle: 0,
    },
    {
      x: entityWidth / 3,
      y: -(entityHeight / 2) - anchorLength,
      angle: 0,
    },
    {
      x: entityWidth / 2 + anchorLength,
      y: 0,
      angle: 90,
    },
    {
      x: entityWidth / 3,
      y: entityHeight / 2 + anchorLength,
      angle: 180,
    },
    {
      x: 0,
      y: entityHeight / 2 + anchorLength,
      angle: 180,
    },
    {
      x: -(entityWidth / 3),
      y: entityHeight / 2 + anchorLength,
      angle: 180,
    },
  ];

  const drawEntities = () =>
    props.components.entities.map((entity) => (
      <Entity key={entity.id} id={entity.id} name={entity.name} type={entity.type} x={entity.x} y={entity.y} />
    ));

  const drawExtensions = () =>
    props.components.extensions.map((extension) => (
      <Extension
        key={extension.id}
        id={extension.id}
        parentId={extension.parentId}
        type={extension.type}
        participation={extension.participation}
        cardinality={extension.cardinality}
        x={extension.x}
        y={extension.y}
      />
    ));

  const drawRelationships = () =>
    props.components.relationships.map((relationship) => (
      <Relationship
        key={relationship.id}
        id={relationship.id}
        name={relationship.name}
        type={relationship.type}
        x={relationship.x}
        y={relationship.y}
      />
    ));

  const drawAttributes = () =>
    props.components.attributes.map((attribute) => (
      <Attribute
        key={attribute.id}
        id={attribute.id}
        parentId={attribute.parentId}
        name={attribute.name}
        type={attribute.type}
        x={attribute.x}
        y={attribute.y}
      />
    ));

  const drawLabels = () =>
    props.components.labels.map((label) => (
      <Label
        key={label.id}
        id={label.id}
        text={label.text}
        x={label.x}
        y={label.y}
        width={label.width}
        height={label.height}
      />
    ));

  // Responsible  for drawing every line connecting things in the diagram
  const drawLines = () => {
    const lineList = []; // The list with all the lines eventually being rendered
    const lockedAnchorPoints = []; // Array with the anchor points that are occupied for the current entity
    let connectId; // parentId of current attribute
    let child;
    let anchor; // Object that holds the location of the anchor to connect too and the angle at which it ll be displayed
    let specificValuesPoints; // Object that holds the location for specificValues text
    let specificValuesText; // Object that holds the value for the text of specificValues
    let parent;
    let keyIndex = 0; // Only used to distinguish items in a list

    // This loop creates the lines that connect attributes to their parents
    for (let attribute of props.components.attributes) {
      connectId = attribute.parentId;
      if (!(parent = getComponentById(connectId))) continue;

      let dash = attribute.type.optional ? [3, 3] : false;

      lineList.push(
        <Line
          key={keyIndex}
          stroke="black"
          strokeWidth={2}
          dash={dash}
          points={[attribute.x, attribute.y, parent.x, parent.y]}
        />
      );
      keyIndex = keyIndex + 1;
    }

    // This loop creates the lines that connect extensions to their parents and children
    for (let extension of props.components.extensions) {
      // Extension-Children lines
      for (let xconnection of extension.xconnections) {
        connectId = xconnection.connectId;
        if (!(child = getComponentById(connectId))) continue;
        lineList.push(
          <Line key={keyIndex} stroke={"black"} strokeWidth={2} points={[extension.x, extension.y, child.x, child.y]} />
        );
        keyIndex = keyIndex + 1;
        if (extension.type === "specialize") {
          let extensionSplinePos = {
            x: (extension.x + child.x) / 2,
            y: (extension.y + child.y) / 2,
          };
          let angle = (Math.atan((extension.y - child.y) / (extension.x - child.x)) * 180) / Math.PI;
          let auxAngle;
          if (child.x > extension.x) auxAngle = 90;
          else auxAngle = 270;
          angle = angle - auxAngle;
          lineList.push(
            <ExtensionSpline key={keyIndex} x={extensionSplinePos.x} y={extensionSplinePos.y} angle={angle} />
          );
          keyIndex = keyIndex + 1;
        }
      }

      // Extension-Parent lines
      connectId = extension.parentId;
      if (!(parent = getComponentById(connectId))) continue;
      lineList.push(
        <Line
          key={keyIndex}
          stroke="black"
          strokeWidth={extension.participation === "partial" ? 2 : 6}
          points={[extension.x, extension.y, parent.x, parent.y]}
        />
      );
      keyIndex = keyIndex + 1;
      if (extension.participation === "total") {
        lineList.push(
          <Line key={keyIndex} stroke="white" strokeWidth={2} points={[extension.x, extension.y, parent.x, parent.y]} />
        );
        keyIndex = keyIndex + 1;
      }

      if (extension.type === "union") {
        let extensionSplinePos = {
          x: (extension.x + parent.x) / 2,
          y: (extension.y + parent.y) / 2,
        };
        let angle = (Math.atan((extension.y - parent.y) / (extension.x - parent.x)) * 180) / Math.PI;
        let auxAngle;
        if (parent.x > extension.x) auxAngle = 90;
        else auxAngle = 270;
        angle = angle - auxAngle;
        lineList.push(
          <ExtensionSpline key={keyIndex} x={extensionSplinePos.x} y={extensionSplinePos.y} angle={angle} />
        );
        keyIndex = keyIndex + 1;
      }
    }

    // This loop creates the lines that connect relationships with entities
    for (let relationship of props.components.relationships) {
      for (let connection of relationship.connections) {
        if (connection.connectId !== 0) {
          connectId = connection.connectId;
          let entity = getComponentById(connectId);

          // If current connection 8 connections don't draw any line
          if (entity.connectionCount > 8) continue;

          // Get the nearest available anchor to this relationship for this connected entity
          anchor = findNearestAnchor(lockedAnchorPoints, entity, relationship);

          specificValuesPoints = calculateSpecificValuesPoints(anchor, relationship);

          lineList.push(
            <Line
              key={keyIndex}
              stroke="black"
              strokeWidth={2}
              points={[relationship.x, relationship.y, anchor.x, anchor.y]}
            />
          );
          keyIndex = keyIndex + 1;

          lineList.push(
            <Anchor
              key={keyIndex}
              x={anchor.x}
              y={anchor.y}
              angle={anchor.angle}
              minimum={connection.min}
              maximum={connection.max}
            />
          );
          keyIndex = keyIndex + 1;

          if (connection.role) {
            lineList.push(
              <SpecificValues
                key={keyIndex}
                x={specificValuesPoints.roleTextPos.x}
                y={specificValuesPoints.roleTextPos.y}
                text={connection.role}
              />
            );
            keyIndex = keyIndex + 1;
          }

          if (connection.exactMin || connection.exactMax) {
            specificValuesText =
              "(" +
              (connection.exactMin === "" ? "-" : connection.exactMin) +
              "," +
              (connection.exactMax === "" ? "N" : connection.exactMax) +
              ")";

            lineList.push(
              <SpecificValues
                key={keyIndex}
                x={specificValuesPoints.anchorTextPoint.x}
                y={specificValuesPoints.anchorTextPoint.y}
                text={specificValuesText}
              />
            );
            keyIndex = keyIndex + 1;
          }
        }
      }
    }
    return lineList;
  };

  // Calculates locations for specific values
  const calculateSpecificValuesPoints = (anchor, relationship) => {
    // Place role text between relationship and entity
    const roleTextPos = {
      x: (anchor.x + relationship.x) / 2,
      y: (anchor.y + relationship.y) / 2,
    };

    // Relatively position anchor text based on the angle of the anchor
    let anchorTextPoint = { x: anchor.x, y: anchor.y };
    switch (anchor.angle) {
      case 0:
        anchorTextPoint.y -= 15;
        break;
      case 90:
        anchorTextPoint.x += 25;
        break;
      case 180:
        anchorTextPoint.y += 15;
        break;
      case -90:
        anchorTextPoint.x -= 25;
        break;
      default:
        break;
    }
    return { roleTextPos: roleTextPos, anchorTextPoint: anchorTextPoint };
  };

  const findNearestAnchor = (lockedAnchorPoints, entity, relationship) => {
    const distances = []; // All distances from the relationship to the entity's anchors
    let anchorId;
    for (let i in entityAnchors) {
      anchorId = entity.id.toString() + i.toString();

      // If current anchor is occupied then ignore it, else include its distance for calculation
      if (!lockedAnchorPoints.includes(anchorId)) {
        distances.push({
          anchorIndex: i,
          anchorId: anchorId,
          distance: distance(
            {
              x: entity.x + entityAnchors[i].x,
              y: entity.y + entityAnchors[i].y,
            },
            {
              x: relationship.x,
              y: relationship.y,
            }
          ),
        });
      }
    }
    const min = minJsonArray(distances, "distance"); // Get the anchor with the smallest distance
    lockedAnchorPoints.push(min.anchorId);
    return {
      x: entity.x + entityAnchors[min.anchorIndex].x,
      y: entity.y + entityAnchors[min.anchorIndex].y,
      angle: entityAnchors[min.anchorIndex].angle,
    };
  };

  const stageClicked = (e) => {
    // Deselect when user clicks the white space
    if (e.target === e.target.getStage()) props.deselect();
  };

  const getStage = () => stage; // Get reference to the stage

  return (
    <ReactReduxContext.Consumer>
      {({ store }) => (
        <div>
          <div ref={stage} className="stage">
            <Stage width={stageWidth} height={stageHeight} onClick={(e) => stageClicked(e)}>
              <Provider store={store}>
                <Layer>
                  <Rect width={stageWidth} height={stageHeight} fill="white" listening={false} />
                  {drawLines()}
                  {drawExtensions()}
                  {drawRelationships()}
                  {drawEntities()}
                  {drawAttributes()}
                  {drawLabels()}
                </Layer>
              </Provider>
            </Stage>
          </div>
          <Properties getStage={getStage} />
        </div>
      )}
    </ReactReduxContext.Consumer>
  );
};

const mapStateToProps = (state) => ({
  components: state.components,
});

const mapDispatchToProps = {
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Surface);
