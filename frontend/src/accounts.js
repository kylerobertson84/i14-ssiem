import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/accounts/';

export const fetchTodos = async () => {
    const response = await axios.get(`${API_URL}todos/`);
    return response.data;
};