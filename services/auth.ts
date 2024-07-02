import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

export const getRefreshToken = (): string | undefined => {
    return Cookies.get('refresh_token');
};

export const refreshToken = async () => {
    try {
        const refresh_token = getRefreshToken()
        const response = await axios.post(`${API_URL}/token/refresh/`, {
            'refresh': refresh_token,
        });
        const { access } = response.data;
    
        Cookies.set('access_token', access, { expires: 7 });

        return response.data;
    } catch (error) {
        console.error('Refresh failed', error);

        throw error
    }
};
