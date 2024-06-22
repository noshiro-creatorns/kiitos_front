import Link from 'next/link';
import Image from 'next/image';
import logoImage1 from '../public/static/logo-1.png';
import logoImage2 from '../public/static/logo-2.png';
import logoImage3 from '../public/static/logo-3.png';
import styles from './HamburgerMenu.module.css';

const Header: React.FC = () => {
  return (
    <header className="border-b flex items-center h-14 px-4 bg-blue-base">
      <h1>
        <Link href="/home" className="text-2xl font-logo">
            <Image src={logoImage1} width={100} height={20} alt="logo" className={`${styles.menu_icon}`}/>
            <Image src={logoImage2} width={100} height={20} alt="logo" className={`${styles.menu_icon}`}/>
            <Image src={logoImage3} width={100} height={20} alt="logo" className={`${styles.menu_icon}`}/>
        </Link>
      </h1>
    </header>
  );
};

export default Header;