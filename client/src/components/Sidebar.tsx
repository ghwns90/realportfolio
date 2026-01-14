import React from 'react';
import { IoMailOutline, IoSettingsOutline, IoPhonePortraitOutline, IoCalendarOutline, IoLocationOutline } from 'react-icons/io5';
import { FaGithub, FaInstagram, FaBlog } from 'react-icons/fa';
import styles from './Sidebar.module.css';
import {Link} from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebarCard}>
      {/* 프로필 이미지와 이름 */}
      <div className={styles.infoSection}>
        <figure className={styles.avatarBox}>
          <img src="/images/my-avatar.png" alt="Profile" width="80" style={{borderRadius: '50%'}} />
        </figure>

        <div className={styles.infoContent}>
          <h1 className={styles.name} title="내 이름">내 이름</h1>
          <p className={styles.title}>Application Developer</p>
        </div>
      </div>

      {/* 상세 연락처 정보 */}
      <div className={styles.moreInfo}>
        <div className={styles.separator}></div>
        <ul className={styles.contactsList}>
          <ContactItem 
            icon={<IoMailOutline />} 
            title="EMAIL" 
            value="sunbae@example.com" 
          />
          <ContactItem 
            icon={<IoPhonePortraitOutline />} 
            title="PHONE" 
            value="010-1234-5678" 
          />
          <ContactItem 
            icon={<IoCalendarOutline />} 
            title="BIRTHDAY" 
            value="1995-01-01" 
          />
          <ContactItem 
            icon={<IoLocationOutline />} 
            title="LOCATION" 
            value="Seoul, South Korea" 
          />
        </ul>

        <div className={styles.separator}></div>

        {/* 3. 소셜 링크 */}
        <div className={styles.socialList}>
          <a href="https://github.com" className={styles.socialLink}><FaGithub /></a>
          <a href="#" className={styles.socialLink}><FaInstagram /></a>
          <a href="#" className={styles.socialLink}><FaBlog /></a>
        </div>
      </div>

      <div className={styles.adminLink}>
        <Link to="/admin/login">
          <IoSettingsOutline />
        </Link>
      </div>
      
    </div>
  );
};

// 내부적으로만 쓸 작은 컴포넌트 (반복되는 구조 줄이기!)
interface ContactItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, title, value }) => (
  <li className={styles.contactItem}>
    <div className={styles.iconBox}>{icon}</div>
    <div className={styles.contactInfo}>
      <p className={styles.contactTitle}>{title}</p>
      <address className={styles.contactValue}>{value}</address>
    </div>
  </li>
);

export default Sidebar;