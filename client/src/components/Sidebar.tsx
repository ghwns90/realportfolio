import React from 'react';
import { IoMailOutline, IoPhonePortraitOutline, IoCalendarOutline, IoLocationOutline } from 'react-icons/io5';
import { FaGithub, FaInstagram, FaBlog, FaCog } from 'react-icons/fa';
import styles from './Sidebar.module.css';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { BASE_URL } from '../constants/api';
import Loading from './Loading';

const Sidebar: React.FC = () => {

  const navigate = useNavigate();

  const { data: profile, isLoading } = useProfile();

  const handleAdminClick = () => {
    const token = localStorage.getItem('accessToken');
    // 토큰있으면 RequireAuth가 알아서 걸러줌
    if(token) {
      navigate('/admin');
    }else{
      navigate('/admin/login');
    }
  };

  if(isLoading) return <Loading/>

  return (
    <aside className={styles.sidebarCard}>
      <button onClick={handleAdminClick} className={styles.adminBtn} aria-label="Admin Settings">
        <FaCog />
      </button>
      {/* 프로필 이미지와 이름 */}
      <div className={styles.infoSection}>
        <figure className={styles.avatarBox}>
          <img 
            src={profile.avatarUrl || '/images/my-avatar.png'} 
            alt={profile?.name} width="120" style={{borderRadius: '50%'}} 
          />
        </figure>

        <div className={styles.infoContent}>
          <h1 className={styles.name}>{profile?.name}</h1>
          <span className={styles.title}>{profile?.role}</span>          
        </div>
      </div>

      {/* 상세 연락처 정보 */}
      <div className={styles.moreInfo}>
        <div className={styles.separator}></div>
        <ul className={styles.contactsList}>
          <ContactItem 
            icon={<IoMailOutline />} 
            title="EMAIL" 
            value={profile?.email} 
          />
          <ContactItem 
            icon={<IoPhonePortraitOutline />} 
            title="PHONE" 
            value={profile?.phone} 
          />
          <ContactItem 
            icon={<IoCalendarOutline />} 
            title="BIRTHDAY" 
            value={profile?.birthday}
          />
          <ContactItem 
            icon={<IoLocationOutline />} 
            title="LOCATION" 
            value={profile?.location}
          />
        </ul>

        <div className={styles.separator}></div>

        {/* 3. 소셜 링크 */}
        <div className={styles.socialList}>
          <a href={profile?.socials.github || 'https://www.github.com'} className={styles.socialLink} target='_blank'><FaGithub /></a>
          <a href={profile?.socials.instagram || 'https://www.instagram.com'} className={styles.socialLink} target='_blank'><FaInstagram /></a>
          <a href={profile?.socials.blog || ''} className={styles.socialLink} target='_blank'><FaBlog /></a>
        </div>
      </div>      
    </aside>
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