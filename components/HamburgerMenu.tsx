"use client";

import { useEffect, useState } from 'react';
import { getAccessToken, logout } from '../services/auth';
import Link from 'next/link';
import styles from './HamburgerMenu.module.css';
import Image from 'next/image';
import homeImage from '../public/static/icon_home.png';
import attendanceImage from '../public/static/icon_attendance.png';
import custodyChildcareImage from '../public/static/icon_custody_childcare.png';
import settingsImage from '../public/static/icon_settings.png';
import logoutImage from '../public/static/icon_logout.png';
import contactImage from '../public/static/icon_contact.png';

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return (
    <div className={styles.hamburgerMenu}>
      <button className={`${styles.hamburgerButton} ${isOpen ? styles.open : ''}`} onClick={toggleMenu}>
        ☰
      </button>
      {isOpen && (
        <div className={`${styles.menu} ${isOpen ? styles.open : ''}`}>
          <Link id="home" href="/home"><Image src={homeImage} width={20} height={20} alt="Home" className={`${styles.menu_icon}`}/>ホーム</Link>
          <Link href="/attendance"><Image src={attendanceImage} width={20} height={20} alt="Home" className={`${styles.menu_icon}`}/>出席簿</Link>
          <Link href="/custody_childcare"><Image src={custodyChildcareImage} width={20} height={20} alt="Home" className={`${styles.menu_icon}`}/>預かり保育</Link>
          <Link href="/contact"><Image src={contactImage} width={20} height={20} alt="Home" className={`${styles.menu_icon}`}/>連絡帳</Link>
          <Link href="/settings"><Image src={settingsImage} width={20} height={20} alt="Home" className={`${styles.menu_icon}`}/>設定</Link>
          <Link href="/login" onClick={handleLogout}><Image src={logoutImage} width={20} height={20} alt="Home" className={`${styles.menu_icon}`}/>ログアウト</Link>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;