import axios from "axios";

const api = axios.create({
  baseURL: "https://andikarna-001-site1.ltempurl.com/api",
});

export const getUser = (token) =>
  api.get("/Authentication/GetUser", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const register = async ({ username, email, password, token }) => {
  const response = await api.get(
    `/Authentication/CreateUser?Username=${encodeURIComponent(
      username
    )}&Password=${encodeURIComponent(password)}&Email=${encodeURIComponent(email)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  );

  return response.data;
};

export const login = async ({ email, password }) => {

  const response = await api.post(
    `/Authentication/login`,
    {
      email: email,
      password: password
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    });

  return response.data;
};

export const logout = async (id) => {
  const response = await api.delete(
    `/Authentication/Logout?id=${encodeURIComponent(id)}`, {
    headers: {
      "Content-Type": "application/json",
    },
  }
  );

  return response.data;
};

export const refreshToken = async ({ token, refreshToken }) => {
  const response = await api.post(
    `/Authentication/RefreshToken`,
    {
      token: token,
      refreshToken: refreshToken
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};