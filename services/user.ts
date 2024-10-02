import { useState, useEffect } from 'react';
import { getAccessToken, refreshToken } from '../services/auth';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/** todo: ユーザーのアカウント種別を取得する処理を実装 */ 
export const useUser = () => {
    const [user, setUser] = useState(null);
    const token = getAccessToken();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_URL}/user/me/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (error) {
                console.error('Failed to fetch user', error);
            }
        };

        fetchUser();
    }, [token]);

    return { user };
};