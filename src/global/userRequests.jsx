import axios from "axios";
import { serverHost, timeout } from "./constants";

export const register = async (newUser, cancelToken) => {
  try {
    return await axios.post(serverHost + "/user/register", newUser, {
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

export const login = async (user, cancelToken) => {
  try {
    return await axios.post(serverHost + "/user/login", user, {
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

export const editprofile = async (newInfo, cancelToken) => {
  try {
    return await axios.post(serverHost + "/user/editprofile", newInfo, {
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

export const forgotpassword = async (email, cancelToken) => {
  try {
    return await axios.post(serverHost + "/user/forgotpassword", email, {
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

export const resetpassword = async (newPass, cancelToken) => {
  try {
    return await axios.post(
      serverHost + "/user/resetpassword",
      { password: newPass.password, confirmPassword: newPass.confirmPassword },
      {
        headers: { Authorization: "Bearer " + newPass.token },
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
