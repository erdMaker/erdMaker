import axios from "axios";
import { store } from "../index";
import { serverHost, timeout } from "./constants";

export const getdiagram = (diagramId, cancelToken) => {
  return axios
    .post(
      serverHost + "/diagram/getdiagram",
      { id: diagramId },
      {
        withCredentials: true,
        timeout: timeout,
        cancelToken: cancelToken.token,
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        throw err;
      } else {
        return err.response;
      }
    });
};

export const savediagram = (cancelToken) => {
  return axios
    .post(
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
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        throw err;
      } else {
        return err.response;
      }
    });
};

export const duplicatediagram = (diagramid, cancelToken) => {
  return axios
    .post(
      serverHost + "/diagram/duplicatediagram",
      {
        id: diagramid,
      },
      {
        withCredentials: true,
        timeout: timeout,
        cancelToken: cancelToken.token,
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        throw err;
      } else {
        return err.response;
      }
    });
};

export const deletediagram = (diagramid, cancelToken) => {
  return axios
    .post(
      serverHost + "/diagram/deletediagram",
      {
        id: diagramid,
      },
      {
        withCredentials: true,
        timeout: timeout,
        cancelToken: cancelToken.token,
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        throw err;
      } else {
        return err.response;
      }
    });
};

export const exportdiagram = (cancelToken) => {
  return axios
    .post(
      serverHost + "/diagram/exportdiagram",
      {
        data: {
          components: store.getState().components,
          meta: store.getState().meta,
        },
      },
      { timeout: timeout, cancelToken: cancelToken.token }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        throw err;
      } else {
        return err.response;
      }
    });
};

export const importdiagram = (diagram, cancelToken) => {
  return axios
    .post(
      serverHost + "/diagram/importdiagram",
      {
        data: diagram,
      },
      {
        timeout: timeout,
        cancelToken: cancelToken.token,
      }
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        throw err;
      } else {
        return err.response;
      }
    });
};
