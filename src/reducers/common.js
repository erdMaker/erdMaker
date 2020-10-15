const selectionInitialState = {
  current: {
    type: null,
    id: null,
    parentId: null,
  },
  selectionExists: false,
};

const stageInitialState = {
  sidepanelWidth: 0,
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
    case "UPDATE_SIDEPANEL_WIDTH":
      var sidepanelWidth;
      if (window.innerWidth <= 527) sidepanelWidth = { standard: 100, wide: 100 };
      else if (window.innerWidth <= 1060) sidepanelWidth = { standard: 40, wide: 50 };
      else sidepanelWidth = { standard: 25, wide: 30 };
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
