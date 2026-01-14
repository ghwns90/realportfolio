import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { HiMenuAlt2 } from 'react-icons/hi'; // 햄버거 아이콘
import AdminSidebar from './AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout: React.FC = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* 사이드바 */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* 메인 콘텐츠 영역 */}
      <main className={styles.mainContent}>
        {/* 모바일용 헤더 (햄버거 버튼) */}
        <header className={styles.mobileHeader}>
          <button 
            className={styles.menuBtn} 
            onClick={() => setIsSidebarOpen(true)}
          >
            <HiMenuAlt2 />
          </button>
          <span className={styles.mobileTitle}>Admin Dashboard</span>
        </header>

        {/* 실제 페이지 내용이 들어가는 곳 */}
        <div className={styles.contentWrapper}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;