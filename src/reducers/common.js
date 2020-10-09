// Exporting this variables for other reducers
export const toolbarHeight = 60;
export var screenWidth = window.innerWidth;
export var screenHeight = window.innerHeight;
export const stageWidth = 2176;
export const stageHeight = 1224;
export const entityWidth = 110;
export const entityHeight = 45;
export const entityWeakOffset = 10;
export const relationshipWidth = 60;
export const relationshipHeight = 30;
export const attributeRadiusX = 50;
export const attributeRadiusY = 25;
export const multivaluedAttributeOffset = 4;
export const nameSize = 12;
export const labelTextSize = 200;
export const labelMinWidth = 150;
export const labelMinHeight = 40;
export const labelMaxWidth = 400;
export const labelMaxHeight = 400;
export const attributeSpawnRadius = 150;
export const identifyingRelationshipOffset = 5;
export var sidepanelWidth;
export const anchorLength = 30;
export const savePeriod = 5000;
export const resizeRectOffset = 1000;

const selectionInitialState = {
  current: {
    type: null,
    id: null,
    parentId: null,
  },
  selectionExists: false,
};

const stageInitialState = {
  toolbarHeight: toolbarHeight,
  screenWidth: screenWidth,
  screenHeight: screenHeight,
  stageHeight: stageHeight,
  stageWidth: stageWidth,
  fontSize: 13,
  entityWidth: entityWidth,
  entityHeight: entityHeight,
  entityWeakOffset: entityWeakOffset,
  relationshipWidth: relationshipWidth,
  relationshipHeight: relationshipHeight,
  attributeRadiusX: attributeRadiusX,
  attributeRadiusY: attributeRadiusY,
  nameSize: nameSize,
  labelTextSize: labelTextSize,
  labelMinWidth: labelMinWidth,
  labelMinHeight: labelMinHeight,
  labelMaxWidth: labelMaxWidth,
  labelMaxHeight: labelMaxHeight,
  attributeSpawnRadius: attributeSpawnRadius,
  multivaluedAttributeOffset: multivaluedAttributeOffset,
  identifyingRelationshipOffset: identifyingRelationshipOffset,
  sidepanelWidth: sidepanelWidth,
  anchorLength: anchorLength,
  savePeriod: savePeriod,
  resizeRectOffset: resizeRectOffset,
};

const generalInitialState = {
  serverTime: null,
  activeDiagramId: null,
};

export const selectionReducer = (state = selectionInitialState, action) => {
  switch (action.type) {
    case "SELECT":
      return {
        ...state,
        current: {
          type: action.payload.type,
          id: action.payload.id,
          parentId: action.payload.parentId,
        },
        selectionExists: true,
      };
    case "DESELECT":
      return selectionInitialState;
    default:
      return state;
  }
};

export const stageReducer = (state = stageInitialState, action) => {
  switch (action.type) {
    case "UPDATE_SCREEN_SIZE":
      screenHeight = window.innerHeight;
      screenWidth = window.innerWidth;
      return {
        ...state,
        screenHeight: screenHeight,
        screenWidth: screenWidth,
      };
    case "UPDATE_SIDEPANEL_WIDTH":
      if (window.innerWidth <= 527) sidepanelWidth = { general: 100, relationship: 100 };
      else if (window.innerWidth <= 1060) sidepanelWidth = { general: 40, relationship: 50 };
      else sidepanelWidth = { general: 25, relationship: 30 };
      return {
        ...state,
        sidepanelWidth: sidepanelWidth,
      };
    default:
      return state;
  }
};

export const generalReducer = (state = generalInitialState, action) => {
  switch (action.type) {
    case "SET_SERVER_TIME":
      return {
        ...state,
        serverTime: action.payload,
      };
    case "SET_ACTIVE_DIAGRAM":
      return {
        ...state,
        activeDiagramId: action.payload,
      };
    case "RESET_ACTIVE_DIAGRAM":
      return {
        ...state,
        activeDiagramId: null,
      };
    default:
      return state;
  }
};
