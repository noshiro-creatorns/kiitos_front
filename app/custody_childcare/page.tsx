"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../../services/auth';
import Header from '../../components/Header';
import HamburgerMenu from '../../components/HamburgerMenu';

const CustodyChildcarePage: React.FC = () => {
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
            <h1>預かり保育</h1>
            <p>初期表示は現在の日とし、年、月、日を選択可能とし、選択した際には、選択されている予約情報または預かり結果情報がリロードされる</p>
            <p>初期表示は、預かり保育予約として、預かり保育予約・預かり保育結果を選択可能にする</p>
            <p>クラスを選択可能にする</p>
            <p>園児名の入力欄を作り、絞り込み可能とする</p>
        </div>
    </div>
  );
};

export default CustodyChildcarePage;