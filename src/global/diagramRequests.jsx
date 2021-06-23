import axios from "axios";
import { store } from "../index";
import { serverHost, timeout } from "./constants";

export const getdiagram = async (diagramId, cancelToken) => {
  try {
    return await axios.post(
      serverHost + "/diagram/getdiagram",
      { id: diagramId },
      {
        withCredentials: true,
        timeout: timeout,
        cancelToken: cancelToken.token,
      }
    );
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const savediagram = async (cancelToken) => {
  try {
    return await axios.post(
      serverHost + "/diagram/savediagram",
      {
        id: store.getState().general.activeDiagramId,
        data: {
          components: store.getState().components,
          meta: store.getState().meta,
        },
      },
      {
        withCredentials: true,
        timeout: timeout,
        cancelToken: cancelToken.token,
      }
    );
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const duplicatediagram = async (diagramid, cancelToken) => {
  try {
    return await axios.post(
      serverHost + "/diagram/duplicatediagram",
      {
        id: diagramid,
      },
      {
        withCredentials: true,
        timeout: timeout,
        cancelToken: cancelToken.token,
      }
    );
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const deletediagram = async (diagramid, cancelToken) => {
  try {
    return await axios.post(
      serverHost + "/diagram/deletediagram",
      {
        id: diagramid,
      },
      {
        withCredentials: true,
        timeout: timeout,
        cancelToken: cancelToken.token,
      }
    );
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const exportdiagram = async (cancelToken) => {
  try {
    return await axios.post(
      serverHost + "/diagram/exportdiagram",
      {
        data: {
          components: store.getState().components,
          meta: store.getState().meta,
        },
      },
      { timeout: timeout, cancelToken: cancelToken.token }
    );
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const importdiagram = async (diagram, cancelToken) => {
  try {
    return await axios.post(
      serverHost + "/diagram/importdiagram",
      {
        data: diagram,
      },
      {
        timeout: timeout,
        cancelToken: cancelToken.token,
      }
    );
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};
