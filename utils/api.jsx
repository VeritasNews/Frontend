// utils/api.js
import axios from 'axios';

export const getArticles = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/articles/');
        return response.data;  // Return the data (articles)
    } catch (error) {
        console.error(error);
        return [];
    }
};
