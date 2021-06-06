import axios from "axios";
import { serverHost, timeout } from "./constants";

export const register = (newUser, cancelToken) => {
  return axios
    .post(serverHost + "/user/register", newUser, {
      timeout: timeout,
      cancelToken: cancelToken.token,
    })
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

export const login = (user, cancelToken) => {
  return axios
    .post(serverHost + "/user/login", user, {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    })
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

export const resend = (cancelToken) => {
  return axios
    .get(serverHost + "/user/resend", {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    })
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

export const profile = (cancelToken) => {
  return axios
    .get(serverHost + "/user/profile", {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    })
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

export const editprofile = (newInfo, cancelToken) => {
  return axios
    .post(serverHost + "/user/editprofile", newInfo, {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    })
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

export const logout = () => {
  return axios
    .get(serverHost + "/user/logout", {
      withCredentials: true,
      timeout: timeout,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err.response;
    });
};

export const forgotpassword = (email, cancelToken) => {
  return axios
    .post(serverHost + "/user/forgotpassword", email, {
      timeout: timeout,
      cancelToken: cancelToken.token,
    })
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

export const changepassword = (cancelToken) => {
  return axios
    .get(serverHost + "/user/changepassword", {
      withCredentials: true,
      timeout: timeout,
      cancelToken: cancelToken.token,
    })
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

export const resetpassword = (newPass, cancelToken) => {
  return axios
    .post(
      serverHost + "/user/resetpassword",
      { password: newPass.password, confirmPassword: newPass.confirmPassword },
      {
        headers: { Authorization: "Bearer " + newPass.token },
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
