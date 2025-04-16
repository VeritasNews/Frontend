import axios from 'axios';
import { getAuthToken } from './authAPI';

const BASE_URL = 'http://localhost:8000/api/';

export const getUserProfile = async () => {
  const token = await getAuthToken();
  if (!token) throw new Error("No token found");

  try {
    const response = await axios.get(`${BASE_URL}users/me/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const savePreferredCategories = async (categories) => {
  const token = await getAuthToken();
  if (!token) throw new Error('No authentication token found.');

  const response = await axios.post(`${BASE_URL}save_preferences/`, { categories }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getLikedArticles = async () => {
  const token = await getAuthToken();
  try {
    const response = await axios.get(`${BASE_URL}users/me/liked_articles/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching liked articles:", error);
    return [];
  }
};

export const searchUsers = async (query) => {
  const token = await getAuthToken();
  const response = await axios.get(`${BASE_URL}users/search/`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query }
  });
  return response.data;
};