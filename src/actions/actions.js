export const ADD_ENTITY = "ADD_ENTITY";
export const ADD_RELATIONSHIP = "ADD_RELATIONSHIP";
export const UPDATE_POSITION_ENTITY = "UPDATE_POSITION_ENTITY";
export const UPDATE_POSITION_RELATIONSHIP = "UPDATE_POSITION_RELATIONSHIP";
export const SELECT = "SELECT";
export const DESELECT = "DESELECT";
export const SET_NAME_ENTITY = "SET_NAME_ENTITY";
export const SET_NAME_RELATIONSHIP = "SET_NAME_RELATIONSHIP";
export const ADD_ATTRIBUTE = "ADD_ATTRIBUTE";
export const UPDATE_POSITION_ATTRIBUTE = "UPDATE_POSITION_ATTRIBUTE";
export const SET_NAME_ATTRIBUTE = "SET_NAME_ATTRIBUTE";
export const DELETE_ENTITY = "DELETE_ENTITY";
export const DELETE_RELATIONSHIP = "DELETE_RELATIONSHIP";
export const DELETE_ATTRIBUTE = "DELETE_ATTRIBUTE";
export const ADD_CONNECTION = "ADD_CONNECTION";
export const CHANGE_CONNECTION = "CHANGE_CONNECTION";
export const DELETE_CONNECTION = "DELETE_CONNECTION";
export const STORE_USER_DATA = "STORE_USER_DATA";
export const REMOVE_USER_DATA = "REMOVE_USER_DATA";
export const SET_ACTIVE_DIAGRAM = "SET_ACTIVE_DIAGRAM";
export const SET_DIAGRAM_FETCHED = "SET_DIAGRAM_FETCHED";
export const SET_TITLE = "SET_TITLE";
export const RESET_ACTIVE_DIAGRAM = "RESET_ACTIVE_DIAGRAM";
export const SET_SERVER_TIME = "SET_SERVER_TIME";
export const SET_META = "SET_META";
export const RESET_META = "RESET_META";
export const SET_TYPE_ENTITY = "SET_TYPE_ENTITY";
export const SET_TYPE_RELATIONSHIP = "SET_TYPE_RELATIONSHIP";
export const SET_TYPE_ATTRIBUTE = "SET_TYPE_ATTRIBUTE";
export const ADD_LABEL = "ADD_LABEL";
export const UPDATE_POSITION_LABEL = "UPDATE_POSITION_LABEL";
export const SET_TEXT_LABEL = "SET_TEXT_LABEL";
export const DELETE_LABEL = "DELETE_LABEL";
export const RESIZE_LABEL = "RESIZE_LABEL";
export const REPOSITION_COMPONENTS = "REPOSITION_COMPONENTS";
export const SET_COMPONENTS = "SET_COMPONENTS";
export const RESET_COMPONENTS = "RESET_COMPONENTS";
export const DELETE_CHILDREN = "DELETE_CHILDREN";
export const UPDATE_POSITION_CHILDREN = "UPDATE_POSITION_CHILDREN";
export const MODIFY_CONNECTION = "MODIFY_CONNECTION";
export const UPDATE_SIDEPANEL_WIDTH = "UPDATE_SIDEPANEL_WIDTH";
export const ADD_EXTENSION = "ADD_EXTENSION";
export const MODIFY_EXTENSION = "MODIFY_EXTENSION";
export const UPDATE_POSITION_EXTENSION = "UPDATE_POSITION_EXTENSION";
export const DELETE_EXTENSION = "DELETE_EXTENSION";
export const ADD_XCONNECTION = "ADD_XCONNECTION";
export const CHANGE_XCONNECTION = "CHANGE_XCONNECTION";
export const DELETE_XCONNECTION = "DELETE_XCONNECTION";

export const addEntity = () => ({
  type: "ADD_ENTITY",
});

export const addRelationship = () => ({
  type: "ADD_RELATIONSHIP",
});

export const updatePositionEntity = (payload) => ({
  type: "UPDATE_POSITION_ENTITY",
  payload: payload,
});

export const updatePositionRelationship = (payload) => ({
  type: "UPDATE_POSITION_RELATIONSHIP",
  payload: payload,
});

export const select = (payload) => ({
  type: "SELECT",
  payload: payload,
});

export const deselect = () => ({
  type: "DESELECT",
});

export const setNameEntity = (payload) => ({
  type: "SET_NAME_ENTITY",
  payload: payload,
});

export const setNameRelationship = (payload) => ({
  type: "SET_NAME_RELATIONSHIP",
  payload: payload,
});

export const addAttribute = (payload) => ({
  type: "ADD_ATTRIBUTE",
  payload: payload,
});

export const updatePositionAttribute = (payload) => ({
  type: "UPDATE_POSITION_ATTRIBUTE",
  payload: payload,
});

export const setNameAttribute = (payload) => ({
  type: "SET_NAME_ATTRIBUTE",
  payload: payload,
});

export const deleteEntity = (payload) => ({
  type: "DELETE_ENTITY",
  payload: payload,
});

export const deleteRelationship = (payload) => ({
  type: "DELETE_RELATIONSHIP",
  payload: payload,
});

export const deleteAttribute = (payload) => ({
  type: "DELETE_ATTRIBUTE",
  payload: payload,
});

export const addConnection = (payload) => ({
  type: "ADD_CONNECTION",
  payload: payload,
});

export const changeConnection = (payload) => ({
  type: "CHANGE_CONNECTION",
  payload: payload,
});

export const deleteConnection = (payload) => ({
  type: "DELETE_CONNECTION",
  payload: payload,
});

export const storeUserData = (payload) => ({
  type: "STORE_USER_DATA",
  payload: payload,
});

export const removeUserData = () => ({
  type: "REMOVE_USER_DATA",
});

export const setActiveDiagram = (payload) => ({
  type: "SET_ACTIVE_DIAGRAM",
  payload: payload,
});

export const setDiagramFetched = (payload) => ({
  type: "SET_DIAGRAM_FETCHED",
  payload: payload,
});

export const setTitle = (payload) => ({
  type: "SET_TITLE",
  payload: payload,
});

export const resetMeta = () => ({
  type: "RESET_META",
});

export const resetActiveDiagram = () => ({
  type: "RESET_ACTIVE_DIAGRAM",
});

export const setServerTime = (payload) => ({
  type: "SET_SERVER_TIME",
  payload: payload,
});

export const setMeta = (payload) => ({
  type: "SET_META",
  payload: payload,
});

export const setTypeEntity = (payload) => ({
  type: "SET_TYPE_ENTITY",
  payload: payload,
});

export const addLabel = () => ({
  type: "ADD_LABEL",
});

export const updatePositionLabel = (payload) => ({
  type: "UPDATE_POSITION_LABEL",
  payload: payload,
});

export const setTextLabel = (payload) => ({
  type: "SET_TEXT_LABEL",
  payload: payload,
});

export const deleteLabel = (payload) => ({
  type: "DELETE_LABEL",
  payload: payload,
});

export const resizeLabel = (payload) => ({
  type: "RESIZE_LABEL",
  payload: payload,
});

export const repositionComponents = () => ({
  type: "REPOSITION_COMPONENTS",
});

export const setComponents = (payload) => ({
  type: "SET_COMPONENTS",
  payload: payload,
});

export const resetComponents = () => ({
  type: "RESET_COMPONENTS",
});

export const setTypeRelationship = (payload) => ({
  type: "SET_TYPE_RELATIONSHIP",
  payload: payload,
});

export const setTypeAttribute = (payload) => ({
  type: "SET_TYPE_ATTRIBUTE",
  payload: payload,
});

export const updatePositionChildren = (payload) => ({
  type: "UPDATE_POSITION_CHILDREN",
  payload: payload,
});

export const deleteChildren = (payload) => ({
  type: "DELETE_CHILDREN",
  payload: payload,
});

export const modifyConnection = (payload) => ({
  type: "MODIFY_CONNECTION",
  payload: payload,
});

export const updateSidepanelWidth = () => ({
  type: "UPDATE_SIDEPANEL_WIDTH",
});

export const addExtension = (payload) => ({
  type: "ADD_EXTENSION",
  payload: payload,
});

export const modifyExtension = (payload) => ({
  type: "MODIFY_EXTENSION",
  payload: payload,
});

export const updatePositionExtension = (payload) => ({
  type: "UPDATE_POSITION_EXTENSION",
  payload: payload,
});

export const deleteExtension = (payload) => ({
  type: "DELETE_EXTENSION",
  payload: payload,
});

export const addXConnection = (payload) => ({
  type: "ADD_XCONNECTION",
  payload: payload,
});

export const changeXConnection = (payload) => ({
  type: "CHANGE_XCONNECTION",
  payload: payload,
});

export const deleteXConnection = (payload) => ({
  type: "DELETE_XCONNECTION",
  payload: payload,
});
