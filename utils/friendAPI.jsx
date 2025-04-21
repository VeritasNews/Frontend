import axios from 'axios';
import { getAuthToken } from './authAPI';

const BASE_URL = 'http://localhost:8000/api/';

const formatProfilePictureUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  if (url.startsWith('http')) return url;
  
  return `http://localhost:8000${url.startsWith('/') ? '' : '/'}${url}`;
};

const processFriendRequestData = (data) => {
  console.log('Processing raw API data:', JSON.stringify(data, null, 2));
  
  return data.map(request => {
    const processed = { ...request };
    const pictureProps = ['profilePicture', 'profile_picture', 'avatar', 'profile_pic', 'profilePic'];
    
    pictureProps.forEach(prop => {
      if (processed[prop]) {
        processed[prop] = formatProfilePictureUrl(processed[prop]);
      }
    });
    
    if (processed.sender) {
      pictureProps.forEach(prop => {
        if (processed.sender[prop]) {
          processed.sender[prop] = formatProfilePictureUrl(processed.sender[prop]);
        }
      });
    }
    
    if (processed.user) {
      pictureProps.forEach(prop => {
        if (processed.user[prop]) {
          processed.user[prop] = formatProfilePictureUrl(processed.user[prop]);
        }
      });
    }
    
    return processed;
  });
};

export const sendFriendRequest = async (userId) => {
  const token = await getAuthToken();
  return axios.post(`${BASE_URL}friends/send/${userId}/`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const acceptFriendRequest = async (userId) => {
  const token = await getAuthToken();
  return axios.post(`${BASE_URL}friends/accept/${userId}/`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const rejectFriendRequest = async (userId) => {
  const token = await getAuthToken();
  return axios.post(`${BASE_URL}friends/reject/${userId}/`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const fetchFriends = async () => {
  const token = await getAuthToken();
  const response = await axios.get(`${BASE_URL}friends/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const fetchFriendRequests = async () => {
  const token = await getAuthToken();
  try {
    const response = await axios.get(`${BASE_URL}friends/requests/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Original API response:', response.data);
    
    const processedData = processFriendRequestData(response.data);
    
    console.log('Processed data with formatted URLs:', processedData);
    
    return processedData;
  } catch (error) {
    console.error('Error in fetchFriendRequests:', error);
    throw error;
  }
};

export const getFriendsLikedArticles = async () => {
  const token = await getAuthToken();
  const response = await axios.get(`${BASE_URL}articles/friends_liked/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getFriendsWhoLikedArticle = async (articleId) => {
  const token = await getAuthToken();
  const response = await axios.get(`${BASE_URL}articles/${articleId}/friends_liked/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};