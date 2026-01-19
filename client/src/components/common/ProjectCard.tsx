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
    period?: string;
    isDemoActive: boolean;
    techStack: string[];
  };
  isPreview: boolean; // 프리뷰모드일때는 클릭 방지 처리
}

const ProjectCard: React.FC<ProjectCardProps> = ({data, isPreview}) => {

  const { title, description, thumbnailUrl, period, githubUrl, demoUrl, isDemoActive, techStack } = data;
  
  const getImageUrl = () => {
    if (!thumbnailUrl) return null;
    
    // 1. 프리뷰 모드(blob:...)일 때는 주소를 그대로 사용
    if (isPreview) return thumbnailUrl;
    
    // 2. 실제 DB 데이터일 때는 백엔드 BASE_URL을 앞에 붙임
    // 예: http://localhost:5000 + /uploads/projects/abc.png
    return `${BASE_URL}${thumbnailUrl}`;
  };

  const imageUrl = getImageUrl();

  

  return (
    <div className={`${styles.card} ${isPreview ? styles.previewMode : ''}`}>
      <div className={styles.imgBox}>
        {imageUrl ? (
          <img src={imageUrl} />
        ): (
          null
        )}
        
        <div className={`${styles.indicator} ${isDemoActive ? styles.active : styles.inactive}`}></div>
        
        {/* 🔗 링크 아이콘 레이어 (프리뷰가 아닐 때만 실제 동작) */}
        {!isPreview && (
          <div className={styles.overlay}>
            {githubUrl && <a href={githubUrl} target="_blank" rel="noreferrer"><FaGithub /></a>}
            {demoUrl && <a href={demoUrl} target="_blank" rel="noreferrer"><FaExternalLinkAlt /></a>}
          </div>
        )}
      </div>
      
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <h4 className={styles.title}>{title || "Project Title"}</h4>
          {period && <span className={styles.period}>{period}</span>}
        </div>
        <p className={styles.description}>{description || "프로젝트 설명을 입력해주세요."}</p>
        <div className={styles.techList}>
          {techStack?.map(tech => <span key={tech} className={styles.techTag}>{tech}</span>)}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;