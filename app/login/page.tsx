"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../services/auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/home'); // ログイン成功後にリダイレクト
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="bg-blue-base flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-700">Logo</h1>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">Email:</label>
                <input
                    type="email"
                    id="email"
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit" className="w-full bg-navy-base text-white py-2 rounded-lg shadow-lg transition duration-300">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
