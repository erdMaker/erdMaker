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
  var newState = {};
  Object.assign(newState, state);
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
            name: "<New>",
            x: stage.scrollLeft + window.innerWidth / 2,
            y: stage.scrollTop + window.innerHeight / 2,
            type: "regular",
            connectionCount: 0, // Number of connections
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
            text: "",
            x: action.payload.x,
            y: action.payload.y,
            type: "undefined",
            participation: "partial",
            cardinality: "disjoint",
            xconnections: [],
            //connectionCount: 0, // Number of connections
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
                  xconnection.id === action.payload.xconnectionIndex
                    ? { ...xconnection, connectId: action.payload.connectId }
                    : xconnection
                ),
              }
            : extension
        ),
      };
    case "DELETE_XCONNECTION":
      return {
        ...state,
        extensions: state.extensions.map((extension) =>
          extension.id === action.payload.extensionId
            ? {
                ...extension,
                xconnections: extension.xconnections.filter(
                  (xconnection) => xconnection.id !== action.payload.xconnectionId
                ),
              }
            : extension
        ),
      };
    case "ADD_RELATIONSHIP":
      return {
        ...state,
        relationships: [
          ...state.relationships,
          {
            id: state.count + 1,
            name: "<New>",
            x: stage.scrollLeft + window.innerWidth / 2,
            y: stage.scrollTop + window.innerHeight / 2,
            type: {
              weak: false,
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
      return {
        ...state,
        relationships: state.relationships.map((relationship) =>
          relationship.id === action.payload.id
            ? { ...relationship, type: { ...relationship.type, [action.payload.type]: action.payload.checked } }
            : relationship
        ),
      };
    case "DELETE_RELATIONSHIP":
      // Reduce connectionCount of involved entities
      function adjustEntities(connection) {
        for (let j in newState.entities) {
          if (newState.entities[j].id === connection.connectId) newState.entities[j].connectionCount--;
        }
      }
      for (let i in newState.relationships) {
        if (newState.relationships[i].id === action.payload.id)
          newState.relationships[i].connections.forEach(adjustEntities);
      }
      newState.relationships = newState.relationships.filter((relationship) => relationship.id !== action.payload.id);
      return newState;
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
    case "CHANGE_CONNECTION": // Change connected entity
      var prevConnectId = 0;
      for (let i in newState.relationships) {
        if (newState.relationships[i].id === action.payload.parentId)
          for (let j in newState.relationships[i].connections) {
            if (newState.relationships[i].connections[j].id === action.payload.id) {
              prevConnectId = newState.relationships[i].connections[j].connectId;
              newState.relationships[i].connections[j] = {
                ...newState.relationships[i].connections[j],
                connectId: action.payload.connectId,
              };
            }
          }
      }
      for (let i in newState.entities) {
        if (newState.entities[i].id === prevConnectId)
          newState.entities[i] = {
            ...newState.entities[i],
            connectionCount: newState.entities[i].connectionCount - 1,
          };
        if (newState.entities[i].id === action.payload.connectId)
          newState.entities[i] = {
            ...newState.entities[i],
            connectionCount: newState.entities[i].connectionCount + 1,
          };
      }
      return newState;
    case "MODIFY_CONNECTION":
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
        for (let i in newState.entities) {
          if (newState.entities[i].id === action.payload.connectId)
            newState.entities[i] = {
              ...newState.entities[i],
              connectionCount: newState.entities[i].connectionCount - 1,
            };
        }
        for (let i in newState.relationships) {
          if (newState.relationships[i].id === action.payload.parentId)
            newState.relationships[i].connections = newState.relationships[i].connections.filter(
              (connection) => connection.id !== action.payload.id
            );
        }
        return newState;
      } else {
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
    case "DELETE_CHILDREN":
      getChildren(childrenList, state.attributes, action.payload.id); // Retrieve children of component with provided id
      return {
        ...state,
        attributes: state.attributes.filter((attribute) => !childrenList.includes(attribute.id)),
      };
    case "UPDATE_POSITION_CHILDREN": // Moves children along with parent component
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
    case "ADD_LABEL":
      return {
        ...state,
        labels: [
          ...state.labels,
          {
            id: state.count + 1,
            text: "<New>",
            x: stage.scrollLeft + window.innerWidth / 2,
            y: stage.scrollTop + window.innerHeight / 2,
            width: 150,
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
    case "REPOSITION_COMPONENTS": // Used to return all components within stage bound if dragged off
      for (let i in newState.entities) {
        if (newState.entities[i].x > stageWidth - entityWidth / 2 - dragBoundOffset)
          newState.entities[i].x = stageWidth - entityWidth / 2 - dragBoundOffset;
        else if (newState.entities[i].x < entityWidth / 2 + dragBoundOffset)
          newState.entities[i].x = entityWidth / 2 + dragBoundOffset;
        if (newState.entities[i].y > stageHeight - entityHeight / 2 - dragBoundOffset)
          newState.entities[i].y = stageHeight - entityHeight / 2 - dragBoundOffset;
        else if (newState.entities[i].y < entityHeight / 2 + dragBoundOffset)
          newState.entities[i].y = entityHeight / 2 + dragBoundOffset;
      }
      for (let i in newState.relationships) {
        if (newState.relationships[i].x > stageWidth - relationshipWidth - dragBoundOffset)
          newState.relationships[i].x = stageWidth - relationshipWidth - dragBoundOffset;
        else if (newState.relationships[i].x < relationshipWidth + dragBoundOffset)
          newState.relationships[i].x = relationshipWidth + dragBoundOffset;
        if (newState.relationships[i].y > stageHeight - relationshipHeight - dragBoundOffset)
          newState.relationships[i].y = stageHeight - relationshipHeight - dragBoundOffset;
        else if (newState.relationships[i].y < relationshipHeight + dragBoundOffset)
          newState.relationships[i].y = relationshipHeight + dragBoundOffset;
      }
      for (let i in newState.attributes) {
        if (newState.attributes[i].x > stageWidth - attributeRadiusX - dragBoundOffset)
          newState.attributes[i].x = stageWidth - attributeRadiusX - dragBoundOffset;
        else if (newState.attributes[i].x <= attributeRadiusX + dragBoundOffset)
          newState.attributes[i].x = attributeRadiusX + dragBoundOffset;
        if (newState.attributes[i].y > stageHeight - attributeRadiusY - dragBoundOffset)
          newState.attributes[i].y = stageHeight - attributeRadiusY - dragBoundOffset;
        else if (newState.attributes[i].y <= attributeRadiusY + dragBoundOffset)
          newState.attributes[i].y = attributeRadiusY + dragBoundOffset;
      }
      for (let i in newState.extensions) {
        if (newState.extensions[i].x > stageWidth - extensionRadius - dragBoundOffset)
          newState.extensions[i].x = stageWidth - extensionRadius - dragBoundOffset;
        else if (newState.extensions[i].x <= extensionRadius + dragBoundOffset)
          newState.extensions[i].x = extensionRadius + dragBoundOffset;
        if (newState.extensions[i].y > stageHeight - extensionRadius - dragBoundOffset)
          newState.extensions[i].y = stageHeight - extensionRadius - dragBoundOffset;
        else if (newState.extensions[i].y <= extensionRadius + dragBoundOffset)
          newState.extensions[i].y = extensionRadius + dragBoundOffset;
      }
      for (let i in newState.labels) {
        if (newState.labels[i].x > stageWidth - newState.labels[i].width / 2 - dragBoundOffset)
          newState.labels[i].x = stageWidth - newState.labels[i].width / 2 - dragBoundOffset;
        else if (newState.labels[i].x < newState.labels[i].width / 2 + dragBoundOffset)
          newState.labels[i].x = newState.labels[i].width / 2 + dragBoundOffset;
        if (newState.labels[i].y > stageHeight - newState.labels[i].height / 2 - dragBoundOffset)
          newState.labels[i].y = stageHeight - newState.labels[i].height / 2 - dragBoundOffset;
        else if (newState.labels[i].y < newState.labels[i].height / 2 + dragBoundOffset)
          newState.labels[i].y = newState.labels[i].height / 2 + dragBoundOffset;
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
