import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:4000/api/v1",
});

export function setAuthToken(token) {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
}