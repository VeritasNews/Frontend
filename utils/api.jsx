import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/';  // Update the base URL

/**
 * Fetch all articles
 */
export const getArticles = async () => {
    try {
        const response = await axios.get(`${BASE_URL}articles/`);
        return response.data;  // Return the data (articles)
    } catch (error) {
        console.error("Error fetching articles:", error);
        return [];
    }
};

/**
 * Fetch articles by category
 * @param {string} category - The category to filter by (e.g., "Siyaset", "Teknoloji", etc.)
 */
export const getArticlesByCategory = async (category) => {
    try {
        const response = await axios.get(`${BASE_URL}get_articles/`, {
            params: { category },
        });

        console.log("API Response:", response.data); // ✅ Log API response
        return response.data;
    } catch (error) {
        console.error(`Error fetching articles for category "${category}":`, error);
        return [];
    }
};
/**
 * Login a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 */
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}login/`, {
            email,
            password,
        });
        return response.data;  // Return the response data (e.g., tokens)
    } catch (error) {
        console.error("Error logging in:", error.response?.data || error.message);
        throw error;  // Re-throw the error for handling in the component
    }
};

export const savePreferredCategories = async (categories) => {
    const token = await getAuthToken(); // Retrieve stored token
    if (!token) throw new Error('No authentication token found.');

    const response = await axios.post(
        `${BASE_URL}save_preferences/`, // Use BASE_URL instead of API_URL
        { categories },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

  import AsyncStorage from '@react-native-async-storage/async-storage';

  export const saveAuthToken = async (token) => {
      try {
          await AsyncStorage.setItem("authToken", token);
      } catch (error) {
          console.error("Error saving auth token:", error);
      }
  };
  
  // ✅ Get authentication token
  export const getAuthToken = async () => {
    try {
      return await AsyncStorage.getItem("authToken");
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };
  
  export const registerUser = async (email, name, password) => {
    try {
        const response = await axios.post(`${BASE_URL}register/`, {
            email,
            name,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Registration API Error:", error.response?.data || error.message);
        throw new Error(error.response?.data?.error || "Registration failed. Please try again.");
    }
};


// ✅ Save refresh token
export const saveRefreshToken = async (token) => {
    try {
        await AsyncStorage.setItem("refreshToken", token);
    } catch (error) {
        console.error("Error saving refresh token:", error);
    }
};

// ✅ Get refresh token
export const getRefreshToken = async () => {
    try {
        return await AsyncStorage.getItem("refreshToken");
    } catch (error) {
        console.error("Error getting refresh token:", error);
        return null;
    }
};

// ✅ Refresh the access token
export const refreshAuthToken = async () => {
    try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token found.');

        const response = await axios.post(`${BASE_URL}token/refresh/`, {
            refresh: refreshToken,
        });

        // Save the new access token
        await saveAuthToken(response.data.access);

        return response.data.access;
    } catch (error) {
        console.error("Error refreshing auth token:", error);
        throw error;
    }
};

// ✅ Axios instance with interceptors for token handling
const api = axios.create({
    baseURL: BASE_URL,
});

// Add a request interceptor to include the access token in headers
api.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiry
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is due to an expired token (401) and it's not a retry request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Refresh the access token
                const newToken = await refreshAuthToken();

                // Update the Authorization header
                originalRequest.headers.Authorization = `Bearer ${newToken}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Failed to refresh token:", refreshError);
                // Redirect to login or handle the error
                throw refreshError;
            }
        }

        return Promise.reject(error);
    }
);

export const getArticleById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}articles/${id}/`);
      return response.data; // ✅ Return the full article data
    } catch (error) {
      console.error(`Error fetching article with ID ${id}:`, error);
      return null;
    }
  };

export const likeArticle = async (articleId, token) => {
    const res = await axios.post(`${BASE_URL}articles/${articleId}/like/`, {}, {
    headers: {
        Authorization: `Bearer ${token}`
    }
    });
    return res.data;
};

export const unlikeArticle = async (articleId, token) => {
    const res = await axios.delete(`${BASE_URL}articles/${articleId}/unlike/`, {
        headers: {
        Authorization: `Bearer ${token}`
        }
    });
    return res.data;
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
  

export default api;