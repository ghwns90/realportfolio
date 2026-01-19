import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '../components/common/ProjectCard';
import styles from './Portfolio.module.css'; // 어드민용과 다른 메인용 CSS
import Loading from '../components/Loading';
import { BASE_URL } from '../constants/api';
import type { Project } from '../types/project';

const Portfolio: React.FC = () => {
  
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Web Development', 'Applications'];
  
  const fetchProject = () => fetch(`${BASE_URL}/api/projects`).then(res => res.json());
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['publicProjects'],
    queryFn: fetchProject,
  });

  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects?.filter(p => p.category === activeFilter);

  if(isLoading) return <Loading />;

  return (
    <article className={styles.portfolioPage}>
      <header>
        <h2 className={styles.articleTitle}>My Works</h2>
        <div className={styles.hLine}></div>
      </header>

      {/* 📂 영상 스타일 카테고리 메뉴 */}
      <ul className={styles.filterList}>
        {filters.map(f => (
          <li 
            key={f} 
            className={`${styles.filterItem} ${activeFilter === f ? styles.active : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </li>
        ))}
      </ul>

      {/* 프로젝트 그리드 레이아웃 */}
      <section className={styles.projectGrid}>
        {filteredProjects?.map((project) => (
          <ProjectCard 
            key={project.id}
            data={project}
            isPreview={false} 
          />
        ))}
      </section>
    </article>
  );
};

export default Portfolio;