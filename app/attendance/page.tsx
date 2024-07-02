"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../../services/auth';
import Header from '../../components/Header';
import HamburgerMenu from '../../components/HamburgerMenu';
import AttendanceList from '../../components/AttendanceList';

const AttendancePage: React.FC = () => {
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

  return (
    <div>
        <Header/>
        <div className='base-page-margin'>
            <h1>出席簿</h1>
            <p>初期表示は現在の月とし、年、月を選択可能とし、選択した際には、出席簿情報がリロードされる</p>
            <p>クラスを選択可能にする</p>
            <p>出席状況から絞り込み選択可能とする</p>
            <p>園児名の入力欄を作り、絞り込み可能とする</p>
            <AttendanceList/>
        </div>
        <HamburgerMenu/>
    </div>
  );
};

export default AttendancePage;