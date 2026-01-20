import React from 'react';
import { NavLink } from 'react-router-dom';
import { IoClose } from 'react-icons/io5';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  
  const menus = [
    { name: 'About', path: '/about' },
    { name: 'Resume', path: '/resume' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      {/* 오버레이 */}
      <div className={`${styles.overlay} ${isOpen ? styles.active : ''}`} onClick={onClose} />

      {/* 슬라이딩 메뉴 */}
      <aside className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <button onClick={onClose} className={styles.closeBtn}>
          <IoClose />
        </button>

        <div className={styles.navWrapper}>
          <h2 className={styles.menuTitle}>Navigation</h2>
          <nav className={styles.nav}>
            {menus.map((m) => (
              <NavLink 
                key={m.name}
                to={m.path}
                className={ ({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
                onClick={onClose}
              >
                {m.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className={styles.footer}>
          <p>© 2024 HoJun Yun</p>
        </div>
        
      </aside>
    </>
  )

}

export default MobileMenu;