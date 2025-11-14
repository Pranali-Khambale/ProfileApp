import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const profileAPI = {
  // Get all profiles
  getAllProfiles: async () => {
    try {
      const response = await api.get("/profiles");
      return response.data;
    } catch (error) {
      console.error("Error fetching profiles:", error);
      throw error;
    }
  },

  // Get single profile
  getProfile: async (id) => {
    try {
      const response = await api.get(`/profiles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },
};

export default api;
