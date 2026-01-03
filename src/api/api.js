import axios from "axios";

const api = axios.create({
  baseURL: "https://andikarna-001-site1.ltempurl.com/api",
  // baseURL: "https://localhost:7086/api",
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

// =========================================================================
// CRUD: Experience, Skills, Projects, Articles
// =========================================================================

// EXPERIENCE
export const getExperiences = async (page = 1, limit = 3, token) => {
  const response = await api.get(`/Experience/GetList?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
};

export const getExperienceById = async (id, token) => {
  const response = await api.get(`/Experience/GetById?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createExperience = async (data, token) => {
  const response = await api.post("/Experience/Create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
};

export const updateExperience = async (id, data, token) => {
  const response = await api.put(`/Experience/Update?id=${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteExperience = async (id, token) => {
  const response = await api.delete(`/Experience/Delete?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return response.data;
};

// SKILLS
export const getSkills = async () => {
  const response = await api.get("/Skill/GetList");
  return response.data;
};

export const getSkillById = async (id, token) => {
  const response = await api.get(`/Skill/GetById?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createSkill = async (data, token) => {
  const response = await api.post("/Skill/Create", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateSkill = async (id, data, token) => {
  const response = await api.put(`/Skill/Update?id=${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteSkill = async (id, token) => {
  const response = await api.delete(`/Skill/Delete?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// PROJECTS
export const getProjects = async () => {
  const response = await api.get("/Project/GetList?page=1&limit=100");
  return response.data;
};

export const getProjectById = async (id, token) => {
  const response = await api.get(`/Project/GetById?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createProject = async (data, token) => {
  const response = await api.post("/Project/Create", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateProject = async (id, data, token) => {
  const response = await api.put(`/Project/Update?id=${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteProject = async (id, token) => {
  const response = await api.delete(`/Project/Delete?id=${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

// ARTICLES
export const getArticles = async (page = 1, limit = 10, search = "", token) => {
  const searchParam = search ? `&search=${encodeURIComponent(search)}` : "";
  const response = await api.get(`/Article/List?page=${page}&limit=${limit}${searchParam}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getArticleById = async (id, token) => {
  const response = await api.get(`/Article/Detail/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createArticle = async (data, token) => {
  const response = await api.post("/Article/Create", data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const updateArticle = async (id, data, token) => {
  const response = await api.put(`/Article/Update/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteArticle = async (id, token) => {
  const response = await api.delete(`/Article/Delete/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};