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

  // Create new profile
  createProfile: async (profileData) => {
    try {
      const response = await api.post("/profiles", profileData);
      return response.data;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (id, profileData) => {
    try {
      const response = await api.put(`/profiles/${id}`, profileData);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Delete profile
  deleteProfile: async (id) => {
    try {
      const response = await api.delete(`/profiles/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw error;
    }
  },
};

export default api;
