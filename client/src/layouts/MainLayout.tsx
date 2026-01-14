import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // 곧 만들 거야!
import Navbar from '../components/Navbar';   // 탭 버튼들
import styles from './MainLayout.module.css'; // CSS Modules 활용

const MainLayout: React.FC = () => {
  return ( 
    <div className={styles.wrapper}>
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

