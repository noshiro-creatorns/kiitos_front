"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../../services/auth';
import Header from '../../components/Header';
import HamburgerMenu from '../../components/HamburgerMenu';

const HomePage: React.FC = () => {
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
            <h1>ホーム画面</h1>
            <p>保護者からの新規連絡（未読分）を表示</p>
            <p>欠席情報の本日分登録状況を表示</p>
            <p>システムからのお知らせを表示</p>
        </div>
    </div>
  );
};

export default HomePage;