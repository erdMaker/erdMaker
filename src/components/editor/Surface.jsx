import React from "react";
import Entity from "./Entity";
import Relationship from "./Relationship";
import Attribute from "./Attribute";
import Label from "./Label";
import SpecificValues from "./SpecificValues";
import Anchor from "./Anchor";
import { Stage, Layer, Line, Rect } from "react-konva";
import Properties from "./Properties";
import { Provider, ReactReduxContext, connect } from "react-redux";
import { deselect } from "../../actions/actions";
import { distance, minJsonArray } from "../../global/utils";

class Surface extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entityAnchors: [
        {
          x: -(this.props.stager.entityWidth / 2) - this.props.stager.anchorLength,
          y: 0,
          angle: -90,
        },
        {
          x: -(this.props.stager.entityWidth / 4),
          y: -(this.props.stager.entityHeight / 2) - this.props.stager.anchorLength,
          angle: 0,
        },
        {
          x: 0,
          y: -(this.props.stager.entityHeight / 2) - this.props.stager.anchorLength,
          angle: 0,
        },
        {
          x: this.props.stager.entityWidth / 4,
          y: -(this.props.stager.entityHeight / 2) - this.props.stager.anchorLength,
          angle: 0,
        },
        {
          x: this.props.stager.entityWidth / 2 + this.props.stager.anchorLength,
          y: 0,
          angle: 90,
        },
        {
          x: this.props.stager.entityWidth / 4,
          y: this.props.stager.entityHeight / 2 + this.props.stager.anchorLength,
          angle: 180,
        },
        {
          x: 0,
          y: this.props.stager.entityHeight / 2 + this.props.stager.anchorLength,
          angle: 180,
        },
        {
          x: -(this.props.stager.entityWidth / 4),
          y: this.props.stager.entityHeight / 2 + this.props.stager.anchorLength,
          angle: 180,
        },
      ],
    };
  }

  drawEntities = () =>
    this.props.components.entities.map((entity) => (
      <Entity key={entity.id} id={entity.id} name={entity.name} type={entity.type} x={entity.x} y={entity.y} />
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

  drawLines = () => {
    function locateIndex(element, index, array) {
      return element.id === Number(connectId);
    }

    var lineList = [];
    var lockedAnchorPoints = [];
    var connectId;
    var index;
    var anchor;
    var specificValuesPoints;
    var specificValuesText;
    var parent;
    var keyIndex = 0;

    for (let i in this.props.components.attributes) {
      connectId = this.props.components.attributes[i].parentId;
      if ((index = this.props.components.entities.findIndex(locateIndex)) !== -1) {
        parent = {
          x: this.props.components.entities[index].x,
          y: this.props.components.entities[index].y,
        };
      } else if ((index = this.props.components.relationships.findIndex(locateIndex)) !== -1) {
        parent = {
          x: this.props.components.relationships[index].x,
          y: this.props.components.relationships[index].y,
        };
      } else if ((index = this.props.components.attributes.findIndex(locateIndex)) !== -1) {
        parent = {
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
          points={[this.props.components.attributes[i].x, this.props.components.attributes[i].y, parent.x, parent.y]}
        />
      );
      keyIndex = keyIndex + 1;
    }

    for (let i = 0; i < this.props.components.relationships.length; i++) {
      for (let j = 0; j < this.props.components.relationships[i].connections.length; j++) {
        if (this.props.components.relationships[i].connections[j].connectId !== 0) {
          connectId = this.props.components.relationships[i].connections[j].connectId;
          index = this.props.components.entities.findIndex(locateIndex);
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
              x={specificValuesPoints.roleTextPoint.x}
              y={specificValuesPoints.roleTextPoint.y}
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

  calculateSpecificValuesPoints = (anchor, relationship) => {
    var roleTextPoint = {
      x: (anchor.x + relationship.x) / 2,
      y: (anchor.y + relationship.y) / 2,
    };

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
    return { roleTextPoint: roleTextPoint, anchorTextPoint: anchorTextPoint };
  };

  findNearestAnchor = (lockedAnchorPoints, entityIndex, relationshipIndex) => {
    var distances = [];
    var anchorId;
    for (let i in this.state.entityAnchors) {
      anchorId = this.props.components.entities[entityIndex].id.toString() + i.toString();
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
    var min = minJsonArray(distances, "distance");
    lockedAnchorPoints.push(min.anchorId);
    return {
      x: this.props.components.entities[entityIndex].x + this.state.entityAnchors[min.anchorIndex].x,
      y: this.props.components.entities[entityIndex].y + this.state.entityAnchors[min.anchorIndex].y,
      angle: this.state.entityAnchors[min.anchorIndex].angle,
    };
  };

  stageClicked = (e) => {
    if (e.target === e.target.getStage()) this.props.deselect();
  };

  getStage = () => this.stage;

  render() {
    return (
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <div>
            <div ref={(ref) => (this.stage = ref)} className="stage">
              <Stage
                width={this.props.stager.stageWidth}
                height={this.props.stager.stageHeight}
                onClick={(e) => this.stageClicked(e)}
              >
                <Provider store={store}>
                  <Layer>
                    <Rect
                      width={this.props.stager.stageWidth}
                      height={this.props.stager.stageHeight}
                      fill="white"
                      stroke="black"
                      strokeWidth={2}
                      listening={false}
                    />
                    {this.drawLines()}
                    {this.drawEntities()}
                    {this.drawRelationships()}
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
  stager: state.stager,
});

const mapDispatchToProps = {
  deselect,
};

export default connect(mapStateToProps, mapDispatchToProps)(Surface);
