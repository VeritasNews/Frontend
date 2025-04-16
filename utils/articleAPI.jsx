import axios from 'axios';
import { getAuthToken } from './authAPI';

const BASE_URL = 'http://localhost:8000/api/';

export const getArticles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}articles/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
};

export const getArticlesByCategory = async (category) => {
  try {
    const response = await axios.get(`${BASE_URL}get_articles/`, { params: { category } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching articles for category "${category}":`, error);
    return [];
  }
};

export const getArticleById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}articles/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching article with ID ${id}:`, error);
    return null;
  }
};

export const likeArticle = async (articleId, token) => {
  const res = await axios.post(`${BASE_URL}articles/${articleId}/like/`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const unlikeArticle = async (articleId, token) => {
  const res = await axios.delete(`${BASE_URL}articles/${articleId}/unlike/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getFriendsLikedArticles = async () => {
  const token = await getAuthToken();
  const response = await axios.get(`${BASE_URL}articles/friends_liked/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getLikedArticles = async () => {
  const token = await getAuthToken(); // 🔐 Ensure user is authenticated

  try {
    const response = await axios.get(`${BASE_URL}users/me/liked_articles/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // ✅ This should be a list of liked articles
  } catch (error) {
    console.error("Error fetching liked articles:", error);
    return [];
  }
};