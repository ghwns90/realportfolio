import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  const navItems = [
    {name: 'About', path: '/about' },
    {name: 'Resume', path: '/resume'},
    {name: 'Portfolio', path: '/portfolio'},
    {name: 'Contact', path: '/contact'}
  ];

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              // isActive 는 NavLink가 제공하는 기능
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;