"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../../services/auth';
import Header from '../../components/Header';
import HamburgerMenu from '../../components/HamburgerMenu';

const ContactPage: React.FC = () => {
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
            <h1>連絡帳</h1>
            <p>初期表示は現在の月とし、年、月を選択可能とし、選択した際には、連絡帳情報がリロードされる。連絡帳情報は、最新のものから表示する</p>
            <p>クラスを選択可能にする</p>
            <p>既読状況から絞り込み選択可能とする</p>
            <p>園児名の入力欄を作り、絞り込み可能とする</p>
        </div>
    </div>
  );
};

export default ContactPage;