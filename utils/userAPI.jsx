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

export const updateProfilePicture = async (imageAsset) => {
  const token = await getAuthToken();

  const formData = new FormData();

  let file;

  if (imageAsset.uri.startsWith("data:image")) {
    // 👇 Convert base64 to Blob
    const byteString = atob(imageAsset.uri.split(',')[1]);
    const mimeString = imageAsset.uri.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    file = new Blob([ab], { type: mimeString });
    formData.append("profile_picture", file, imageAsset.fileName || "profile.jpg");
  } else {
    // 👇 Native-style image (e.g. from Android/iOS)
    formData.append("profile_picture", {
      uri: imageAsset.uri,
      name: imageAsset.fileName || 'profile.jpg',
      type: imageAsset.type || 'image/jpeg',
    });
  }

  try {
    const response = await axios.patch(
      'http://localhost:8000/api/users/update-profile-picture/',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error.response?.data || error.message);
    throw error;
  }
};
