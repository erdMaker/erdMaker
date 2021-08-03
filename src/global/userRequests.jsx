import axios from "axios";
import { serverHost, timeout } from "./constants";

export const register = async (payload, cancelToken) => {
  try {
    return await axios.post(serverHost + "/user/register", payload, {
      timeout: timeout,
      cancelToken: cancelToken.token,
    });
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const login = async (payload, cancelToken) => {
  try {
    return await axios.post(serverHost + "/user/login", payload, {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    });
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const resend = async (cancelToken) => {
  try {
    return await axios.get(serverHost + "/user/resend", {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    });
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const profile = async (cancelToken) => {
  try {
    return await axios.get(serverHost + "/user/profile", {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    });
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const editprofile = async (payload, cancelToken) => {
  try {
    return await axios.post(serverHost + "/user/editprofile", payload, {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    });
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const logout = async () => {
  try {
    return await axios.get(serverHost + "/user/logout", {
      withCredentials: true,
      timeout: timeout,
    });
  } catch (err) {
    return err.response;
  }
};

export const forgotpassword = async (payload, cancelToken) => {
  try {
    return await axios.post(serverHost + "/user/forgotpassword", payload, {
      timeout: timeout,
      cancelToken: cancelToken.token,
    });
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const changepassword = async (cancelToken) => {
  try {
    return await axios.get(serverHost + "/user/changepassword", {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    });
  } catch (err) {
    if (axios.isCancel(err)) {
      throw err;
    } else {
      return err.response;
    }
  }
};

export const resetpassword = async (payload, cancelToken) => {
  try {
    return await axios.post(
      serverHost + "/user/resetpassword",
      { password: payload.password, confirmPassword: payload.confirmPassword },
      {
        headers: { Authorization: "Bearer " + payload.token },
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
