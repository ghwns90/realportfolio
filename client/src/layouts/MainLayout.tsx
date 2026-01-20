import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // 곧 만들 거야!
import Navbar from '../components/Navbar';   // 탭 버튼들
import styles from './MainLayout.module.css'; // CSS Modules 활용
import MobileMenu from '../components/MobileMenu';
import { HiMenuAlt2 } from 'react-icons/hi';

const MainLayout: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return ( 
    <div className={styles.wrapper}>
      {/* 모바일용 햄버거 버튼 */}
      <header className={styles.mobileTopBar}>
        <button className={styles.hamburger} onClick={() => setIsMenuOpen(true)}>
          <HiMenuAlt2 />
        </button>
      </header>

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <div className={styles.container}>
        {/* 프로필 왼쪽 영역 */}
        <aside className={`${styles.sidebar} ${styles.cardStyle}`}>         
          <Sidebar />
          {/* <div style={{ color: 'white' }}>Profile Area</div> */}
        </aside>
    
        {/* 콘텐츠 오른쪽 영역 */}
        <main className={styles.mainContent}>
          <Navbar/>
          <section className={`${styles.contentCard} ${styles.cardStyle}`}>
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

