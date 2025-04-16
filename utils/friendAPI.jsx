import axios from 'axios';
import { getAuthToken } from './authAPI';

const BASE_URL = 'http://localhost:8000/api/';

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
  const response = await axios.get(`${BASE_URL}friends/requests/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};