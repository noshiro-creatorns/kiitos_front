import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="border-b flex items-center h-14 px-4 bg-blue-base">
      <h1>
        <Link href="/home" className="text-2xl font-logo">kiitos</Link>
      </h1>
    </header>
  );
};

export default Header;