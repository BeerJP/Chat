import axios from 'axios';

const baseURL = 'http://127.0.0.1:8000';

export const getMessages = async (authToken, value) => {
  try {
    const response = await axios.get(`${baseURL}/get-msg/${value}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (authToken) => {
  try {
    const response = await axios.get(`${baseURL}/get-user`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postToken = async (payload) => {
    try {
      const response = await axios.post(`${baseURL}/token-get`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const getToken = async (token) => {
  try {
    const response = await axios.get(`${baseURL}/token-check`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};