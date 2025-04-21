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

export const getArticlesForUser = async () => {
  try {
    const token = await getAuthToken(); // 🔐 get stored token
    if (!token) throw new Error("No auth token");

    const response = await axios.get(`${BASE_URL}articles/for_you/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching personalized articles:", error.response?.data || error.message);
    return [];
  }
};

export const logInteraction = async (articleId, action, time_spent = null) => {
  try {
    const token = await getAuthToken();

    if (!token) {
      console.warn("🚫 No token found. Skipping interaction logging.");
      return;
    }

    const res = await axios.post(
      `${BASE_URL}log-interaction/`,
      {
        articleId,
        action,
        time_spent,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
  } catch (err) {
    console.error("❌ Failed to log interaction:", err.response?.data || err.message);
  }
};

const MEDIA_BASE_URL = 'http://localhost:8000'; // or your production base URL

export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${MEDIA_BASE_URL}/${imagePath.replace(/^\/+/, '')}`;
};
