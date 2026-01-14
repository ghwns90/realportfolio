import React, {useState} from 'react';
import { useQuery } from '@tanstack/react-query';
import ProjectCard from '../components/ProjectCard';
import { BASE_URL } from '../constants/api';
import styles from './Portfolio.module.css';
import type { Project } from '../types';
import Loading from '../components/Loading';

const Portfolio: React.FC = () => {

  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Web', 'Application'];

  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch(`${BASE_URL}/api/projects`);

      if(!response.ok) {
        throw new Error('데이터를 가져오는데 실패했습니다');
      }

      return response.json();
    },
  });

  if(isLoading) return <Loading />
  if(error) return <div className={styles.error}>에러가 발생했습니다: {(error as Error).message}</div>;

  // 필터링 로직 : 선택된 카테고리가 'All' 이면 전체, 아니면 해당 카테고리만
  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects?.filter(project => project.category === activeCategory);

  return (
    <section>
      <header>
        <h2 className={styles.title}>Portfolio</h2>
        <div className={styles.titleLine}></div>
      </header>

      {/* 필터 버튼 리스트 */}
      <ul className={styles.filterList}>
        {categories.map((category) => (
          <li key={category}>
            <button 
              className={`${styles.filterBtn} ${activeCategory === category ? styles.active : ''}`}
              onClick={() => setActiveCategory(category)}  
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
      {/* 필터링된 프로젝트 */}
      <ul className={styles.projectList}>
        {filteredProjects && filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <p className={styles.noData}>해당 카테고리의 프로젝트가 없습니다.</p>
        )}
      </ul>
    </section>
  );
};

export default Portfolio;