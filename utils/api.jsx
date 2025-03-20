import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/articles/';

/**
 * Fetch all articles
 */
export const getArticles = async () => {
    try {
        const response = await axios.get(BASE_URL);
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
        const response = await axios.get(BASE_URL, { params: { category } });

        console.log("API Response:", response.data); // ✅ Log API response
        return response.data;
    } catch (error) {
        console.error(`Error fetching articles for category "${category}":`, error);
        return [];
    }
};
