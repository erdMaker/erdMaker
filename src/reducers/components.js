import {
  stageWidth,
  stageHeight,
  screenWidth,
  screenHeight,
  entityWidth,
  entityHeight,
  relationshipWidth,
  relationshipHeight,
  attributeRadiusX,
  attributeRadiusY,
  labelMinWidth,
  labelMinHeight,
  labelMaxWidth,
  labelMaxHeight,
} from "./common";
import { getChildren } from "../global/utils";

const initialState = {
  entities: [],
  relationships: [],
  attributes: [],
  labels: [],
  count: 0,
};

const componentsReducer = (state = initialState, action) => {
  var newState = {};
  var childrenList = [];
  const stage = document.querySelector(".stage");
  switch (action.type) {
    case "ADD_ENTITY":
      return {
        ...state,
        entities: [
          ...state.entities,
          {
            id: state.count + 1,
            name: "<New>" + (state.count + 1),
            x: stage.scrollLeft + screenWidth / 2,
            y: stage.scrollTop + screenHeight / 2,
            type: "regular",
          },
        ],
        count: state.count + 1,
      };
    case "UPDATE_POSITION_ENTITY":
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.payload.id ? { ...entity, x: action.payload.x, y: action.payload.y } : entity
        ),
      };
    case "SET_NAME_ENTITY":
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.payload.id ? { ...entity, name: action.payload.name } : entity
        ),
      };
    case "SET_TYPE_ENTITY":
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.payload.id ? { ...entity, type: action.payload.type } : entity
        ),
      };
    case "DELETE_ENTITY":
      return {
        ...state,
        entities: state.entities.filter((entity) => entity.id !== action.payload.id),
        attributes: state.attributes.filter((attribute) => attribute.parentId !== action.payload.id),
      };
    case "ADD_RELATIONSHIP":
      return {
        ...state,
        relationships: [
          ...state.relationships,
          {
            id: state.count + 1,
            name: "<New>" + (state.count + 1),
            x: stage.scrollLeft + screenWidth / 2,
            y: stage.scrollTop + screenHeight / 2,
            type: {
              identifying: false,
            },
            connections: [],
          },
        ],
        count: state.count + 1,
      };
    case "UPDATE_POSITION_RELATIONSHIP":
      return {
        ...state,
        relationships: state.relationships.map((relationship) =>
          relationship.id === action.payload.id
            ? { ...relationship, x: action.payload.x, y: action.payload.y }
            : relationship
        ),
      };
    case "SET_NAME_RELATIONSHIP":
      return {
        ...state,
        relationships: state.relationships.map((relationship) =>
          relationship.id === action.payload.id ? { ...relationship, name: action.payload.name } : relationship
        ),
      };
    case "SET_TYPE_RELATIONSHIP":
      newState = {};
      Object.assign(newState, state);
      for (let i in newState.relationships) {
        if (newState.relationships[i].id === action.payload.id) {
          newState.relationships[i].type = {
            ...newState.relationships[i].type,
            [action.payload.type]: !newState.relationships[i].type[action.payload.type],
          };
          break;
        }
      }
      return newState;
    case "DELETE_RELATIONSHIP":
      return {
        ...state,
        relationships: state.relationships.filter((relationship) => relationship.id !== action.payload.id),
      };
    case "ADD_CONNECTION":
      return {
        ...state,
        relationships: state.relationships.map((relationship) =>
          relationship.id === action.payload.id
            ? {
                ...relationship,
                connections: [
                  ...relationship.connections,
                  {
                    id: state.count + 1,
                    parentId: action.payload.id,
                    connectId: 0,
                    min: "",
                    max: "",
                    exactMin: "",
                    exactMax: "",
                    role: "",
                  },
                ],
              }
            : relationship
        ),
        count: state.count + 1,
      };
    case "CHANGE_CONNECTION":
      return {
        ...state,
        relationships: state.relationships.map((relationship) =>
          relationship.id === action.payload.parentId
            ? {
                ...relationship,
                connections: relationship.connections.map((connection) =>
                  connection.id === action.payload.id && connection.parentId === action.payload.parentId
                    ? {
                        ...connection,
                        connectId: action.payload.connectId,
                      }
                    : connection
                ),
              }
            : relationship
        ),
      };
    case "MODIFY_CONNECTION":
      newState = {};
      Object.assign(newState, state);
      for (let i in newState.relationships) {
        if (newState.relationships[i].id === action.payload.parentId)
          for (let j in newState.relationships[i].connections) {
            if (newState.relationships[i].connections[j].id === action.payload.id) {
              newState.relationships[i].connections[j] = {
                ...newState.relationships[i].connections[j],
                [action.payload.prop]: action.payload.value,
              };
              break;
            }
          }
      }
      return newState;
    case "DELETE_CONNECTION":
      if (action.payload.id) {
        return {
          ...state,
          relationships: state.relationships.map((relationship) =>
            relationship.id === action.payload.parentId
              ? {
                  ...relationship,
                  connections: relationship.connections.filter((connection) => connection.id !== action.payload.id),
                }
              : relationship
          ),
        };
      } else {
        newState = {};
        Object.assign(newState, state);
        for (let i in newState.relationships) {
          newState.relationships[i].connections = newState.relationships[i].connections.filter(
            (connection) => connection.connectId !== action.payload.connectId
          );
        }
        return newState;
      }
    case "ADD_ATTRIBUTE":
      return {
        ...state,
        attributes: [
          ...state.attributes,
          {
            id: state.count + 1,
            parentId: action.payload.id,
            name: "<New>" + (state.count + 1),
            x: action.payload.x,
            y: action.payload.y,
            type: {
              unique: false,
              multivalued: false,
              optional: false,
              composite: false,
              derived: false,
            },
          },
        ],
        count: state.count + 1,
      };
    case "UPDATE_POSITION_ATTRIBUTE":
      return {
        ...state,
        attributes: state.attributes.map((attribute) =>
          attribute.id === action.payload.id ? { ...attribute, x: action.payload.x, y: action.payload.y } : attribute
        ),
      };
    case "SET_NAME_ATTRIBUTE":
      return {
        ...state,
        attributes: state.attributes.map((attribute) =>
          attribute.id === action.payload.id ? { ...attribute, name: action.payload.name } : attribute
        ),
      };
    case "SET_TYPE_ATTRIBUTE":
      newState = {};
      Object.assign(newState, state);
      for (let i in newState.attributes) {
        if (newState.attributes[i].id === action.payload.id) {
          newState.attributes[i].type = {
            ...newState.attributes[i].type,
            [action.payload.type]: !newState.attributes[i].type[action.payload.type],
          };
          break;
        }
      }
      return newState;
    case "DELETE_ATTRIBUTE":
      return {
        ...state,
        attributes: state.attributes.filter((attribute) => attribute.id !== action.payload.id),
      };
    case "DELETE_CHILDREN":
      childrenList = [];
      getChildren(childrenList, state.attributes, action.payload.id);
      return {
        ...state,
        attributes: state.attributes.filter((attribute) => !childrenList.includes(attribute.id)),
      };
    case "UPDATE_POSITION_CHILDREN":
      childrenList = [];
      getChildren(childrenList, state.attributes, action.payload.id);
      return {
        ...state,
        attributes: state.attributes.map((attribute) =>
          childrenList.includes(attribute.id)
            ? {
                ...attribute,
                x: attribute.x + action.payload.dx,
                y: attribute.y + action.payload.dy,
              }
            : attribute
        ),
      };
    case "ADD_LABEL":
      return {
        ...state,
        labels: [
          ...state.labels,
          {
            id: state.count + 1,
            text: "<New>" + (state.count + 1),
            x: stage.scrollLeft + screenWidth / 2,
            y: stage.scrollTop + screenHeight / 2,
            width: labelMinWidth,
            height: labelMinHeight,
          },
        ],
        count: state.count + 1,
      };
    case "UPDATE_POSITION_LABEL":
      return {
        ...state,
        labels: state.labels.map((label) =>
          label.id === action.payload.id ? { ...label, x: action.payload.x, y: action.payload.y } : label
        ),
      };
    case "SET_TEXT_LABEL":
      return {
        ...state,
        labels: state.labels.map((label) =>
          label.id === action.payload.id ? { ...label, text: action.payload.text } : label
        ),
      };
    case "RESIZE_LABEL":
      return {
        ...state,
        labels: state.labels.map((label) =>
          label.id === action.payload.id
            ? {
                ...label,
                width:
                  action.payload.width < labelMinWidth
                    ? labelMinWidth
                    : action.payload.width > labelMaxWidth
                    ? labelMaxWidth
                    : action.payload.width,
                height:
                  action.payload.height < labelMinHeight
                    ? labelMinHeight
                    : action.payload.height > labelMaxHeight
                    ? labelMaxHeight
                    : action.payload.height,
              }
            : label
        ),
      };
    case "DELETE_LABEL":
      return {
        ...state,
        labels: state.labels.filter((label) => label.id !== action.payload.id),
      };
    case "REPOSITION_COMPONENTS":
      newState = {};
      var entOffsetX = entityWidth / 2;
      var entOffsetY = entityHeight / 2;
      Object.assign(newState, state);
      for (let i in newState.entities) {
        if (newState.entities[i].x > stageWidth - entOffsetX) newState.entities[i].x = stageWidth - entOffsetX;
        if (newState.entities[i].y > stageHeight - entOffsetY) newState.entities[i].y = stageHeight - entOffsetY;
      }
      for (let i in newState.relationships) {
        if (newState.relationships[i].x > stageWidth - relationshipWidth)
          newState.relationships[i].x = stageWidth - relationshipWidth;
        if (newState.relationships[i].y > stageHeight - relationshipHeight)
          newState.relationships[i].y = stageHeight - relationshipHeight;
      }
      for (let i in newState.attributes) {
        if (newState.attributes[i].x > stageWidth - attributeRadiusX)
          newState.attributes[i].x = stageWidth - attributeRadiusX;
        else if (newState.attributes[i].x <= 0 + attributeRadiusX) newState.attributes[i].x = attributeRadiusX;
        if (newState.attributes[i].y > stageHeight - attributeRadiusY)
          newState.attributes[i].y = stageHeight - attributeRadiusY;
        else if (newState.attributes[i].y <= 0 + attributeRadiusY) newState.attributes[i].y = attributeRadiusY;
      }
      for (let i in newState.labels) {
        if (newState.labels[i].x > stageWidth - newState.labels[i].width)
          newState.labels[i].x = stageWidth - newState.labels[i].width;
        if (newState.labels[i].y > stageHeight - newState.labels[i].height)
          newState.labels[i].y = stageHeight - newState.labels[i].height;
      }
      return newState;
    case "SET_COMPONENTS":
      return action.payload;
    case "RESET_COMPONENTS":
      return initialState;
    default:
      return state;
  }
};

export default componentsReducer;
