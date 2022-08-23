import _ from "lodash";
import {
  stageWidth,
  stageHeight,
  entityWidth,
  entityHeight,
  relationshipWidth,
  relationshipHeight,
  attributeRadiusX,
  attributeRadiusY,
  extensionRadius,
  labelMinWidth,
  labelMinHeight,
  labelMaxWidth,
  labelMaxHeight,
  dragBoundOffset,
} from "../global/constants";

import { getChildren } from "../global/utils";

const initialState = {
  entities: [],
  relationships: [],
  attributes: [],
  extensions: [],
  labels: [],
  count: 0, // Total number of components created in a single diagram (includes deleted).
  // Never decreases and new ids depend on it
};

const componentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_ENTITY": {
      const stage = document.querySelector(".stage");
      const xPosition = window.innerWidth >= stageWidth ? stageWidth / 2 : stage.scrollLeft + window.innerWidth / 2;
      const yPosition = window.innerHeight >= stageHeight ? stageHeight / 2 : stage.scrollTop + window.innerHeight / 2;
      return {
        ...state,
        entities: [
          ...state.entities,
          {
            id: state.count + 1,
            name: "<New>",
            x: xPosition,
            y: yPosition,
            type: "regular",
            connectionCount: 0, // Number of connections
          },
        ],
        count: state.count + 1,
      };
    }
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
        extensions: state.extensions.filter((extension) => extension.parentId !== action.payload.id),
      };
    case "ADD_EXTENSION":
      return {
        ...state,
        extensions: [
          ...state.extensions,
          {
            id: state.count + 1,
            parentId: action.payload.id,
            x: action.payload.x,
            y: action.payload.y,
            type: "undefined",
            participation: "partial",
            cardinality: "disjoint",
            xconnections: [],
          },
        ],
        count: state.count + 1,
      };
    case "UPDATE_POSITION_EXTENSION":
      return {
        ...state,
        extensions: state.extensions.map((extension) =>
          extension.id === action.payload.id ? { ...extension, x: action.payload.x, y: action.payload.y } : extension
        ),
      };
    case "MODIFY_EXTENSION":
      return {
        ...state,
        extensions: state.extensions.map((extension) =>
          extension.id === action.payload.id ? { ...extension, [action.payload.prop]: action.payload.value } : extension
        ),
      };
    case "DELETE_EXTENSION":
      return {
        ...state,
        extensions: state.extensions.filter((extension) => extension.id !== action.payload.id),
      };
    case "ADD_XCONNECTION":
      return {
        ...state,
        extensions: state.extensions.map((extension) =>
          extension.id === action.payload.id
            ? {
                ...extension,
                xconnections: [
                  ...extension.xconnections,
                  {
                    id: state.count + 1,
                    connectId: 0,
                  },
                ],
              }
            : extension
        ),
        count: state.count + 1,
      };
    case "CHANGE_XCONNECTION":
      return {
        ...state,
        extensions: state.extensions.map((extension) =>
          extension.id === action.payload.id
            ? {
                ...extension,
                xconnections: extension.xconnections.map((xconnection) =>
                  xconnection.id === action.payload.xconnectionId
                    ? { ...xconnection, connectId: action.payload.connectId }
                    : xconnection
                ),
              }
            : extension
        ),
      };
    case "DELETE_XCONNECTION": {
      let newState = _.cloneDeep(state);

      let test = () => true;
      if (action.payload.xconnectionId) test = (xconnection) => xconnection.id !== action.payload.xconnectionId;
      else if (action.payload.entityId) test = (xconnection) => xconnection.connectId !== action.payload.entityId;

      for (let extension of newState.extensions) extension.xconnections = extension.xconnections.filter(test);

      if (JSON.stringify(state) === JSON.stringify(newState)) return state;
      else return newState;
    }
    case "ADD_RELATIONSHIP": {
      const stage = document.querySelector(".stage");
      const xPosition = window.innerWidth >= stageWidth ? stageWidth / 2 : stage.scrollLeft + window.innerWidth / 2;
      const yPosition = window.innerHeight >= stageHeight ? stageHeight / 2 : stage.scrollTop + window.innerHeight / 2;
      return {
        ...state,
        relationships: [
          ...state.relationships,
          {
            id: state.count + 1,
            name: "<New>",
            x: xPosition,
            y: yPosition,
            type: {
              weak: false,
            },
            connections: [],
          },
        ],
        count: state.count + 1,
      };
    }
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
      return {
        ...state,
        relationships: state.relationships.map((relationship) =>
          relationship.id === action.payload.id
            ? { ...relationship, type: { ...relationship.type, [action.payload.type]: action.payload.checked } }
            : relationship
        ),
      };
    case "DELETE_RELATIONSHIP": {
      let newState = {};
      Object.assign(newState, state);

      // Reduce connectionCount of involved entities
      function adjustEntities(connection) {
        for (let entity of newState.entities) {
          if (entity.id === connection.connectId) entity.connectionCount--;
        }
      }

      for (let relationship of newState.relationships) {
        if (relationship.id === action.payload.id) relationship.connections.forEach(adjustEntities);
      }
      newState.relationships = newState.relationships.filter((relationship) => relationship.id !== action.payload.id);
      return newState;
    }
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
    case "CHANGE_CONNECTION": {
      // Change connected entity
      let newState = _.cloneDeep(state);

      let prevConnectId = 0;
      for (let relationship of newState.relationships) {
        if (relationship.id === action.payload.parentId)
          for (let connection of relationship.connections) {
            if (connection.id === action.payload.id) {
              prevConnectId = connection.connectId;
              connection.connectId = action.payload.connectId;
            }
          }
      }
      for (let entity of newState.entities) {
        if (entity.id === prevConnectId) entity.connectionCount--;
        if (entity.id === action.payload.connectId) entity.connectionCount++;
      }
      return newState;
    }
    case "MODIFY_CONNECTION": {
      let newState = _.cloneDeep(state);

      for (let relationship of newState.relationships) {
        if (relationship.id === action.payload.parentId)
          for (let connection of relationship.connections) {
            if (connection.id === action.payload.id) {
              Object.assign(connection, { ...connection, [action.payload.prop]: action.payload.value });
              break;
            }
          }
      }
      return newState;
    }
    case "DELETE_CONNECTION": {
      let newState = _.cloneDeep(state);

      if (action.payload.id) {
        for (let entity of newState.entities) {
          if (entity.id === action.payload.connectId) entity.connectionCount--;
        }
        for (let relationship of newState.relationships) {
          if (relationship.id === action.payload.parentId)
            relationship.connections = relationship.connections.filter(
              (connection) => connection.id !== action.payload.id
            );
        }
        return newState;
      } else {
        for (let relationship of newState.relationships) {
          relationship.connections = relationship.connections.filter(
            (connection) => connection.connectId !== action.payload.connectId
          );
        }
        return newState;
      }
    }
    case "ADD_ATTRIBUTE":
      return {
        ...state,
        attributes: [
          ...state.attributes,
          {
            id: state.count + 1,
            parentId: action.payload.id,
            name: "<New>",
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
      return {
        ...state,
        attributes: state.attributes.map((attribute) =>
          attribute.id === action.payload.id
            ? { ...attribute, type: { ...attribute.type, [action.payload.type]: action.payload.checked } }
            : attribute
        ),
      };
    case "DELETE_ATTRIBUTE":
      return {
        ...state,
        attributes: state.attributes.filter((attribute) => attribute.id !== action.payload.id),
      };
    case "DELETE_CHILDREN": {
      let childrenList = [];
      getChildren(childrenList, state.attributes, action.payload.id); // Retrieve children of component with provided id
      return {
        ...state,
        attributes: state.attributes.filter((attribute) => !childrenList.includes(attribute.id)),
      };
    }
    case "UPDATE_POSITION_CHILDREN": {
      // Moves children along with parent component
      const childrenList = [];
      getChildren(childrenList, state.attributes, action.payload.id); // Retrieve children of component with provided id
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
    }
    case "ADD_LABEL": {
      const stage = document.querySelector(".stage");
      const xPosition = window.innerWidth >= stageWidth ? stageWidth / 2 : stage.scrollLeft + window.innerWidth / 2;
      const yPosition = window.innerHeight >= stageHeight ? stageHeight / 2 : stage.scrollTop + window.innerHeight / 2;
      return {
        ...state,
        labels: [
          ...state.labels,
          {
            id: state.count + 1,
            text: "<New>",
            x: xPosition,
            y: yPosition,
            width: 150,
            height: labelMinHeight,
          },
        ],
        count: state.count + 1,
      };
    }
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
    case "REPOSITION_COMPONENTS": {
      // Used to return all components within stage bound if dragged off
      let newState = _.cloneDeep(state);

      for (let entity of newState.entities) {
        if (entity.x > stageWidth - entityWidth / 2 - dragBoundOffset)
          entity.x = stageWidth - entityWidth / 2 - dragBoundOffset;
        else if (entity.x < entityWidth / 2 + dragBoundOffset) entity.x = entityWidth / 2 + dragBoundOffset;
        if (entity.y > stageHeight - entityHeight / 2 - dragBoundOffset)
          entity.y = stageHeight - entityHeight / 2 - dragBoundOffset;
        else if (entity.y < entityHeight / 2 + dragBoundOffset) entity.y = entityHeight / 2 + dragBoundOffset;
      }
      for (let relationship of newState.relationships) {
        if (relationship.x > stageWidth - relationshipWidth - dragBoundOffset)
          relationship.x = stageWidth - relationshipWidth - dragBoundOffset;
        else if (relationship.x < relationshipWidth + dragBoundOffset)
          relationship.x = relationshipWidth + dragBoundOffset;
        if (relationship.y > stageHeight - relationshipHeight - dragBoundOffset)
          relationship.y = stageHeight - relationshipHeight - dragBoundOffset;
        else if (relationship.y < relationshipHeight + dragBoundOffset)
          relationship.y = relationshipHeight + dragBoundOffset;
      }
      for (let attribute of newState.attributes) {
        if (attribute.x > stageWidth - attributeRadiusX - dragBoundOffset)
          attribute.x = stageWidth - attributeRadiusX - dragBoundOffset;
        else if (attribute.x <= attributeRadiusX + dragBoundOffset) attribute.x = attributeRadiusX + dragBoundOffset;
        if (attribute.y > stageHeight - attributeRadiusY - dragBoundOffset)
          attribute.y = stageHeight - attributeRadiusY - dragBoundOffset;
        else if (attribute.y <= attributeRadiusY + dragBoundOffset) attribute.y = attributeRadiusY + dragBoundOffset;
      }
      for (let extension of newState.extensions) {
        if (extension.x > stageWidth - extensionRadius - dragBoundOffset)
          extension.x = stageWidth - extensionRadius - dragBoundOffset;
        else if (extension.x <= extensionRadius + dragBoundOffset) extension.x = extensionRadius + dragBoundOffset;
        if (extension.y > stageHeight - extensionRadius - dragBoundOffset)
          extension.y = stageHeight - extensionRadius - dragBoundOffset;
        else if (extension.y <= extensionRadius + dragBoundOffset) extension.y = extensionRadius + dragBoundOffset;
      }
      for (let label of newState.labels) {
        if (label.x > stageWidth - label.width / 2 - dragBoundOffset)
          label.x = stageWidth - label.width / 2 - dragBoundOffset;
        else if (label.x < label.width / 2 + dragBoundOffset) label.x = label.width / 2 + dragBoundOffset;
        if (label.y > stageHeight - label.height / 2 - dragBoundOffset)
          label.y = stageHeight - label.height / 2 - dragBoundOffset;
        else if (label.y < label.height / 2 + dragBoundOffset) label.y = label.height / 2 + dragBoundOffset;
      }
      if (JSON.stringify(state) === JSON.stringify(newState)) return state;
      else return newState;
    }
    case "SET_COMPONENTS":
      return action.payload;
    case "RESET_COMPONENTS":
      return initialState;
    default:
      return state;
  }
};

export default componentsReducer;
