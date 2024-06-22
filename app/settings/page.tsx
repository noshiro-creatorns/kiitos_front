"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../../services/auth';
import Header from '../../components/Header';
import HamburgerMenu from '../../components/HamburgerMenu';

const SettingsPage: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  if (!isAuthenticated) {
    return <p>Loading...</p>;
  }

  return (
    <div>
        <Header/>
        <HamburgerMenu />
        <div className='base-page-margin'>
            <h1>設定画面</h1>
            <p>各マスター画面への遷移元画面</p>
        </div>
    </div>
  );
};

export default SettingsPage;