"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAccessToken, logout } from '../services/auth';
import './globals.css';

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
      <head>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet"></link>
      </head>
      <body>
        <nav>
          {/*}
          <Link href="/">Home</Link>
          {!isAuthenticated ? (
            <Link href="/login">Login</Link>
          ) : (
            <button onClick={handleLogout}>Logout</button>
          )}
          */}
        </nav>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;