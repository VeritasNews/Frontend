import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/`;

export const saveAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem("authToken", token);
  } catch (error) {
    console.error("Error saving auth token:", error);
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

export const saveRefreshToken = async (token) => {
  try {
    await AsyncStorage.setItem("refreshToken", token);
  } catch (error) {
    console.error("Error saving refresh token:", error);
  }
};

export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem("refreshToken");
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
};

export const refreshAuthToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token found.');

    const response = await axios.post(`${BASE_URL}token/refresh/`, { refresh: refreshToken });
    await saveAuthToken(response.data.access);
    return response.data.access;
  } catch (error) {
    console.error("Error refreshing auth token:", error);
    throw error;
  }
};

export const loginUser = async (identifier, password) => {
  try {
    const response = await axios.post(`${BASE_URL}login/`, { identifier, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (email, name, username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}register/`, {
      email, name, userName: username, password
    });
    return response.data;
  } catch (error) {
    console.error("Registration API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Registration failed. Please try again.");
  }
};

export const getUserProfile = async () => {
  const token = await getAuthToken();
  if (!token) throw new Error("No token found");

  const response = await axios.get(`${BASE_URL}users/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}password-reset/`, { email });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      "Failed to send password reset email. Please try again."
    );
  }
};

export const resetPassword = async (uid, token, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}password-reset/confirm/`, {
      uid,
      token,
      new_password: newPassword
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      "Password reset failed. The link may have expired."
    );
  }
};