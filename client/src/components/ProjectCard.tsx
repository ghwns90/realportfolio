import React from 'react';
import type { Project } from '../types';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <li className={styles.projectItem}>
      <figure className={styles.projectImg}>
        <img 
          src={project.imageUrl || '/images/project-default.png'} 
          alt={project.title} 
        />
        <div className={styles.overlay}>
          <span className={styles.viewIcon}>👁️</span>
        </div>
      </figure>
      <h3 className={styles.projectTitle}>{project.title}</h3>
      <p className={styles.projectCategory}>{project.category}</p>
    </li>
  );
};

export default ProjectCard;