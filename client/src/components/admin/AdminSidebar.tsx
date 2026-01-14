import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FaUserEdit, 
  FaProjectDiagram, 
  FaFileAlt, 
  FaSignOutAlt, 
  FaHome 
} from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import styles from './AdminSidebar.module.css';
import { BASE_URL } from '../../constants/api';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {

    try {
      await fetch(`${BASE_URL}/api/auth/logout`, {method:'POST'});
      
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem('accessToken');
    navigate('/');
  };

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.active : ''}`} 
        onClick={onClose}
      />
      <aside className={`${styles.sidebar} ${isOpen? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.logo}>Admin<span>Panel</span></h2>
          <button className={styles.closeBtn} onClick={onClose}><IoClose /></button>
        </div>

        <nav className={styles.nav}>
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : styles.item}
            onClick={onClose} // 모바일에서 클릭 시 닫기
          >
            <FaHome className={styles.icon} />
            <span>대시보드</span>
          </NavLink>

          <NavLink 
            to="/admin/profile" 
            className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : styles.item}
            onClick={onClose}
          >
            <FaUserEdit className={styles.icon} />
            <span>프로필 관리</span>
          </NavLink>

          <NavLink 
            to="/admin/projects" 
            className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : styles.item}
            onClick={onClose}
          >
            <FaProjectDiagram className={styles.icon} />
            <span>프로젝트 관리</span>
          </NavLink>

          <NavLink 
            to="/admin/resume" 
            className={({ isActive }) => isActive ? `${styles.item} ${styles.active}` : styles.item}
            onClick={onClose}
          >
            <FaFileAlt className={styles.icon} />
            <span>이력서 관리</span>
          </NavLink>
        </nav>

        <div className={styles.footer}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt className={styles.icon} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>
      
    </>
  );  
};

export default AdminSidebar;