import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'https://dev.kiitos-childcare.com/api';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/token/`, {
      email,
      password,
    });
    const { access, refresh } = response.data;
    
    Cookies.set('access_token', access, { expires: 7 });
    Cookies.set('refresh_token', refresh, { expires: 7 });

    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const logout = () => {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
};

export const getAccessToken = (): string | undefined => {
  return Cookies.get('access_token');
};
