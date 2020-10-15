import React from "react";
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

class Surface extends React.Component {
  state = {
    // Define the anchor points for entities
    entityAnchors: [
      {
        x: -(entityWidth / 2) - anchorLength,
        y: 0,
        angle: -90,
      },
      {
        x: -(entityWidth / 4),
        y: -(entityHeight / 2) - anchorLength,
        angle: 0,
      },
      {
        x: 0,
        y: -(entityHeight / 2) - anchorLength,
        angle: 0,
      },
      {
        x: entityWidth / 4,
        y: -(entityHeight / 2) - anchorLength,
        angle: 0,
      },
      {
        x: entityWidth / 2 + anchorLength,
        y: 0,
        angle: 90,
      },
      {
        x: entityWidth / 4,
        y: entityHeight / 2 + anchorLength,
        angle: 180,
      },
      {
        x: 0,
        y: entityHeight / 2 + anchorLength,
        angle: 180,
      },
      {
        x: -(entityWidth / 4),
        y: entityHeight / 2 + anchorLength,
        angle: 180,
      },
    ],
  };

  drawEntities = () =>
    this.props.components.entities.map((entity) => (
      <Entity key={entity.id} id={entity.id} name={entity.name} type={entity.type} x={entity.x} y={entity.y} />
    ));

  drawExtensions = () =>
    this.props.components.extensions.map((extension) => (
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

  drawRelationships = () =>
    this.props.components.relationships.map((relationship) => (
      <Relationship
        key={relationship.id}
        id={relationship.id}
        name={relationship.name}
        type={relationship.type}
        x={relationship.x}
        y={relationship.y}
      />
    ));

  drawAttributes = () =>
    this.props.components.attributes.map((attribute) => (
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

  drawLabels = () =>
    this.props.components.labels.map((label) => (
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
  drawLines = () => {
    // Used with array.findIndex() to find the index of the component with id = connectId
    function locateIndex(element) {
      return element.id === connectId;
    }

    var lineList = []; // The list with all the lines eventually being rendered
    var lockedAnchorPoints = []; // Array with the anchor points that are occupied for the current entity

    // I use connectId to find the index of the parent in its array and then finally retrieve its coordinates
    var connectId; // parentId of current attribute
    var index; // Index of component in its respective array with id = connectId
    var parentCoords; // Location of the parent component
    var childCoords; // Location of a child component

    var anchor; // Object that holds the location of the anchor to connect too and the angle at which it ll be displayed
    var specificValuesPoints; // Object that holds the location for specificValues text
    var specificValuesText; // Object that holds the value for the text of specificValues

    var keyIndex = 0; // Only used to distinguish items in a list

    // This loop creates the lines that connect attributes to their parents
    for (let i in this.props.components.attributes) {
      connectId = this.props.components.attributes[i].parentId;
      if ((index = this.props.components.entities.findIndex(locateIndex)) !== -1) {
        parentCoords = {
          x: this.props.components.entities[index].x,
          y: this.props.components.entities[index].y,
        };
      } else if ((index = this.props.components.relationships.findIndex(locateIndex)) !== -1) {
        parentCoords = {
          x: this.props.components.relationships[index].x,
          y: this.props.components.relationships[index].y,
        };
      } else if ((index = this.props.components.attributes.findIndex(locateIndex)) !== -1) {
        parentCoords = {
          x: this.props.components.attributes[index].x,
          y: this.props.components.attributes[index].y,
        };
      } else {
        continue;
      }
      lineList.push(
        <Line
          key={keyIndex}
          stroke="black"
          strokeWidth={2}
          closed="false"
          points={[
            this.props.components.attributes[i].x,
            this.props.components.attributes[i].y,
            parentCoords.x,
            parentCoords.y,
          ]}
        />
      );
      keyIndex = keyIndex + 1;
    }

    // This loop creates the lines that connect extensions to their parents and children
    for (let i in this.props.components.extensions) {
      // Extension-Children lines
      for (let j in this.props.components.extensions[i].xconnections) {
        connectId = this.props.components.extensions[i].xconnections[j].connectId;
        if ((index = this.props.components.entities.findIndex(locateIndex)) !== -1) {
          childCoords = {
            x: this.props.components.entities[index].x,
            y: this.props.components.entities[index].y,
          };
        } else {
          continue;
        }
        lineList.push(
          <Line
            key={keyIndex}
            stroke={"black"}
            strokeWidth={2}
            closed="false"
            points={[
              this.props.components.extensions[i].x,
              this.props.components.extensions[i].y,
              childCoords.x,
              childCoords.y,
            ]}
          />
        );
        keyIndex = keyIndex + 1;
        if (this.props.components.extensions[i].type === "specialize") {
          let extensionSplinePos = {
            x: (this.props.components.extensions[i].x + childCoords.x) / 2,
            y: (this.props.components.extensions[i].y + childCoords.y) / 2,
          };
          let angle = Math.atan(
            (this.props.components.extensions[i].y - childCoords.y) /
              (this.props.components.extensions[i].x - childCoords.x)
          ) * 180 / Math.PI;
          let auxAngle;
          if (childCoords.x > this.props.components.extensions[i].x) auxAngle = 90;
          else auxAngle = 270;
          angle = angle - auxAngle;
          lineList.push(
            <ExtensionSpline key={keyIndex} x={extensionSplinePos.x} y={extensionSplinePos.y} angle={angle} />
          );
          keyIndex = keyIndex + 1;
        }
      }

      // Extension-Parent lines
      connectId = this.props.components.extensions[i].parentId;
      if ((index = this.props.components.entities.findIndex(locateIndex)) !== -1) {
        parentCoords = {
          x: this.props.components.entities[index].x,
          y: this.props.components.entities[index].y,
        };
      } else {
        continue;
      }
      lineList.push(
        <Line
          key={keyIndex}
          stroke="black"
          strokeWidth={this.props.components.extensions[i].participation === "partial" ? 2 : 6}
          closed="false"
          points={[
            this.props.components.extensions[i].x,
            this.props.components.extensions[i].y,
            parentCoords.x,
            parentCoords.y,
          ]}
        />
      );
      keyIndex = keyIndex + 1;
      if (this.props.components.extensions[i].participation === "total") {
        lineList.push(
          <Line
            key={keyIndex}
            stroke="white"
            strokeWidth={2}
            closed="false"
            points={[
              this.props.components.extensions[i].x,
              this.props.components.extensions[i].y,
              parentCoords.x,
              parentCoords.y,
            ]}
          />
        );
        keyIndex = keyIndex + 1;
      }

      if (this.props.components.extensions[i].type === "union") {
        let extensionSplinePos = {
          x: (this.props.components.extensions[i].x + parentCoords.x) / 2,
          y: (this.props.components.extensions[i].y + parentCoords.y) / 2,
        };
        let angle = Math.atan(
          (this.props.components.extensions[i].y - parentCoords.y) /
            (this.props.components.extensions[i].x - parentCoords.x)
        ) * 180 / Math.PI;
        let auxAngle;
        if (parentCoords.x > this.props.components.extensions[i].x) auxAngle = 90;
        else auxAngle = 270;
        angle = angle - auxAngle;
        lineList.push(
          <ExtensionSpline key={keyIndex} x={extensionSplinePos.x} y={extensionSplinePos.y} angle={angle} />
        );
        keyIndex = keyIndex + 1;
      }
    }

    // This loop creates the lines that connect relationships with entities
    for (let i = 0; i < this.props.components.relationships.length; i++) {
      for (let j = 0; j < this.props.components.relationships[i].connections.length; j++) {
        if (this.props.components.relationships[i].connections[j].connectId !== 0) {
          connectId = this.props.components.relationships[i].connections[j].connectId;
          index = this.props.components.entities.findIndex(locateIndex);

          // If current connection 8 connections don't draw any line
          if (this.props.components.entities[index].connectionCount > 8) continue;

          // Get the nearest available anchor to this relationship for this connected entity
          anchor = this.findNearestAnchor(lockedAnchorPoints, index, i);

          specificValuesPoints = this.calculateSpecificValuesPoints(anchor, this.props.components.relationships[i]);
          lineList.push(
            <Line
              key={keyIndex}
              stroke="black"
              strokeWidth={2}
              closed="false"
              points={[
                this.props.components.relationships[i].x,
                this.props.components.relationships[i].y,
                anchor.x,
                anchor.y,
              ]}
            />
          );

          keyIndex = keyIndex + 1;
          lineList.push(
            <Anchor
              key={keyIndex}
              x={anchor.x}
              y={anchor.y}
              angle={anchor.angle}
              minimum={this.props.components.relationships[i].connections[j].min}
              maximum={this.props.components.relationships[i].connections[j].max}
            />
          );

          keyIndex = keyIndex + 1;
          lineList.push(
            <SpecificValues
              key={keyIndex}
              x={specificValuesPoints.roleTextPos.x}
              y={specificValuesPoints.roleTextPos.y}
              text={this.props.components.relationships[i].connections[j].role}
            />
          );

          keyIndex = keyIndex + 1;
          specificValuesText =
            "(" +
            this.props.components.relationships[i].connections[j].exactMin +
            "," +
            this.props.components.relationships[i].connections[j].exactMax +
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
    return lineList;
  };

  // Calculates locations for specific values
  calculateSpecificValuesPoints = (anchor, relationship) => {
    // Place role text between relationship and entity
    var roleTextPos = {
      x: (anchor.x + relationship.x) / 2,
      y: (anchor.y + relationship.y) / 2,
    };

    // Relatively position anchor text based on the angle of the anchor
    var anchorTextPoint = { x: anchor.x, y: anchor.y };
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

  findNearestAnchor = (lockedAnchorPoints, entityIndex, relationshipIndex) => {
    var distances = []; // All distances from the relationship to the entity's anchors
    var anchorId;
    for (let i in this.state.entityAnchors) {
      anchorId = this.props.components.entities[entityIndex].id.toString() + i.toString();

      // If current anchor is occupied then ignore it, else include its distance for calculation
      if (!lockedAnchorPoints.includes(anchorId)) {
        distances.push({
          anchorIndex: i,
          anchorId: anchorId,
          distance: distance(
            {
              x: this.props.components.entities[entityIndex].x + this.state.entityAnchors[i].x,
              y: this.props.components.entities[entityIndex].y + this.state.entityAnchors[i].y,
            },
            {
              x: this.props.components.relationships[relationshipIndex].x,
              y: this.props.components.relationships[relationshipIndex].y,
            }
          ),
        });
      }
    }
    var min = minJsonArray(distances, "distance"); // Get the anchor with the smallest distance
    lockedAnchorPoints.push(min.anchorId);
    return {
      x: this.props.components.entities[entityIndex].x + this.state.entityAnchors[min.anchorIndex].x,
      y: this.props.components.entities[entityIndex].y + this.state.entityAnchors[min.anchorIndex].y,
      angle: this.state.entityAnchors[min.anchorIndex].angle,
    };
  };

  stageClicked = (e) => {
    // Deselect when user clicks the white space
    if (e.target === e.target.getStage()) this.props.deselect();
  };

  getStage = () => this.stage; // Get reference to the stage

  render() {
    return (
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <div>
            <div ref={(ref) => (this.stage = ref)} className="stage">
              <Stage width={stageWidth} height={stageHeight} onClick={(e) => this.stageClicked(e)}>
                <Provider store={store}>
                  <Layer>
                    <Rect
                      width={stageWidth}
                      height={stageHeight}
                      fill="white"
                      stroke="black"
                      strokeWidth={2}
                      listening={false}
                    />
                    {this.drawLines()}
                    {this.drawRelationships()}
                    {this.drawExtensions()}
                    {this.drawEntities()}
                    {this.drawAttributes()}
                    {this.drawLabels()}
                  </Layer>
                </Provider>
              </Stage>
            </div>
            <Properties getStage={this.getStage} />
          </div>
        )}
      </ReactReduxContext.Consumer>
    );
  }
}

const mapStateToProps = (state) => ({
  components: state.components,
});

const mapDispatchToProps = {
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Surface);
