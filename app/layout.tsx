"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAccessToken, logout } from '../services/auth';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    <html lang="ja">
      <body>
        <nav>
          <Link href="/">Home</Link>
          {!isAuthenticated ? (
            <Link href="/login">Login</Link>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
        </nav>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;