import { store } from "../index.js";
import { logout, profile } from "./userRequests";
import { getdiagram } from "./diagramRequests";
import {
  storeUserData,
  removeUserData,
  setServerTime,
  setComponents,
  repositionComponents,
  setMeta,
  resetActiveDiagram,
  setDiagramFetched,
} from "../actions/actions";

// Fetch profile data of logged user
export const getProfile = async (cancelToken) => {
  try {
    const res = await profile(cancelToken);
    if (res && res.status === 200) {
      store.dispatch(
        storeUserData({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          username: res.data.username,
          confirmed: res.data.confirmed,
          diagrams: res.data.diagrams,
          diagramsOwned: res.data.diagramsOwned,
        })
      );
      store.dispatch(setServerTime(res.data.servertime));
    } else {
      logOut();
    }
  } catch (err) {
    throw err;
  }
};

// Fetches diagram with id = diagramId from the database
export const getDiagram = async (diagramId, cancelToken) => {
  try {
    const res = await getdiagram(diagramId, cancelToken);
    if (res && res.status === 200) {
      const data = makeCompatible(res.data);
      store.dispatch(setComponents(data.components));
      store.dispatch(setMeta(data.meta));
      store.dispatch(repositionComponents());
      store.dispatch(setDiagramFetched({ fetched: true }));
    } else {
      throw new Error("Error while fetching the diagram");
    }
  } catch (err) {
    store.dispatch(resetActiveDiagram());
    window.location.replace("/");
  }
};

// Makes older diagrams compatible with the latest features upon loading
export function makeCompatible(data) {
  if (!data.components.hasOwnProperty("extensions")) {
    return {
      ...data,
      components: {
        ...data.components,
        extensions: [],
      },
    };
  } else {
    return data;
  }
}

export const logOut = async () => {
  try {
    await logout();
    store.dispatch(removeUserData());
    store.dispatch(resetActiveDiagram());
    window.location.replace("/");
  } catch (e) {}
};

// Returns a reference to the diagram component with given id
export function getComponentById(id) {
  const components = store.getState().components;
  const test = (component) => component.id === id;
  let component = null;
  if ((component = components.entities.find(test))) return component;
  else if ((component = components.attributes.find(test))) return component;
  else if ((component = components.extensions.find(test))) return component;
  else if ((component = components.labels.find(test))) return component;
  else {
    for (let relationship of components.relationships) {
      if (relationship.id === id) return relationship;
      for (let connection of relationship.connections) {
        if (connection.id === id) return connection;
      }
    }
  }
  return component;
}
