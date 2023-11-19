import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000';

export const fetchData = async () => {
    try {
      const response = await axios.get(`${baseURL}/get-all`);
      return response.data;
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
};

export const postToken = async (payload) => {
    try {
      const response = await axios.post(`${baseURL}/add`, payload);
      return response.data;
    } catch (error) {
      console.error('There was a problem with the post operation:', error);
      throw error;
    }
};

export const getToken = async (token) => {
  try {
    const response = await axios.get(`${baseURL}/get`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    throw error;
  }
};