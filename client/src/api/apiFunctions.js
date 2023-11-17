import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000';

export const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}/chat/get`);
      return response.data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
};

export const postData = async (payload) => {
    try {
      const response = await axios.post(`${baseURL}/chat/add`, payload);
      return response.data;
    } catch (error) {
      console.error('There was a problem with the post operation:', error);
      throw error;
    }
};