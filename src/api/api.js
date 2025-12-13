import axios from "axios";

const api = axios.create({
  baseURL: "https://andikarna-001-site1.ltempurl.com/api",
});

export const login = (data) =>
  api.post("/Authentication/Login", data);

export const getUser = (token) =>
  api.get("/Authentication/GetUser", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
