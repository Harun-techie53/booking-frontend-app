import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const axiosInstance = (token = null) => {
  const instance = axios.create();

  instance.defaults.headers.post["Content-Type"] = "application/json";
  instance.defaults.headers["Accept"] = "application/json";

  instance.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
  instance.defaults.timeout = 60000;
  instance.defaults.baseURL = API_BASE_URL;
  const authData = localStorage?.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth") || "")
    : "";
  if (authData?.accessToken) {
    token = authData.accessToken;
  }
  if (token) {
    instance.defaults.headers.common["Authorization"] = "Bearer " + token;
  }

  instance.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return instance;
};
export default axiosInstance;
