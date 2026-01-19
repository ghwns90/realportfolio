import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '../components/common/ProjectCard';
import styles from './Projects.module.css'; // 어드민용과 다른 메인용 CSS
import Loading from '../components/Loading';
import { BASE_URL } from '../constants/api';
import type { Project } from '../types/project';

const Projects: React.FC = () => {
  
  
  const fetchProject = () => fetch(`${BASE_URL}/api/projects`).then(res => res.json());
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['publicProjects'],
    queryFn: fetchProject,
  });

  if(isLoading) return <Loading />;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>My Works</h2>
        <p className={styles.subtitle}>프로젝트입니다.</p>
      </header>

      {/* 프로젝트 그리드 레이아웃 */}
      <div className={styles.projectGrid}>
        {projects?.map((project) => (
          <ProjectCard 
            key={project.id}
            data={project}
            isPreview={false} 
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;