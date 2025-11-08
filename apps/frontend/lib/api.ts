import axios from "axios";
import { BACK_URL } from "./utils";


const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const monitorApi = {
  getAll: async () => {
    const { data } = await axios.get(`${BACK_URL}/website/websites`, {
      headers: getAuthHeaders(),
    });
    return data.websites;
  },

  getById: async (websiteId: string) => {
    const { data } = await axios.get(`${BACK_URL}/website/status/${websiteId}`, {
      headers: getAuthHeaders(),
    });
    return data;
  },

  create: async (url: string) => {
    const { data } = await axios.post(
      `${BACK_URL}/website`,
      { url },
      { headers: getAuthHeaders() }
    );
    return data;
  },
};
