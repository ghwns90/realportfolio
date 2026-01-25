import React from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import styles from './ProjectCard.module.css';
import { BASE_URL } from '../../constants/api';

interface ProjectCardProps {
  data: {
    title: string;
    description: string;
    thumbnailUrl?: string;
    githubUrl?: string;
    demoUrl?: string;
    category: string;
    isDemoActive: boolean;
    techStack: string[];
  };
  isPreview: boolean; // 프리뷰모드일때는 클릭 방지 처리
}

const ProjectCard: React.FC<ProjectCardProps> = ({data, isPreview}) => {

  const { title, thumbnailUrl, category, githubUrl, demoUrl, isDemoActive, techStack } = data;
  
  const imageUrl = thumbnailUrl 
  ? (isPreview || thumbnailUrl.startsWith('http') 
      ? thumbnailUrl 
      : `${BASE_URL}${thumbnailUrl}`) 
  : null;

  return (
    <div className={`${styles.card} ${isPreview ? styles.previewMode : ''}`}>
      
      <div className={styles.imgBox}>
        {imageUrl && <img src={imageUrl} />}
        
        
        {/* 🔗 링크 아이콘 레이어 (프리뷰가 아닐 때만 실제 동작) */}
        {!isPreview && (
          <div className={styles.overlay}>
            {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer"><FaGithub /></a>}
            {demoUrl && <a href={demoUrl} target="_blank" rel="noreferrer"><FaExternalLinkAlt /></a>}
          </div>
        )}
        <div className={`${styles.indicator} ${isDemoActive ? styles.active : styles.inactive}`}></div>
      </div>
      
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>        
        {/* <p className={styles.description}>{description}</p> */}
        <p className={styles.categoryText}>{category}</p>        
        <div className={styles.techList}>
          {techStack?.map(tech => <span key={tech} className={styles.techTag}>{tech}</span>)}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;