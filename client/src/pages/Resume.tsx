import React from 'react';
import { IoBookOutline, IoBriefcaseOutline } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import styles from './Resume.module.css';
import Loading from '../components/Loading';
import { BASE_URL } from '../constants/api';

interface ResumeData {
  id: number;
  type: 'education' | 'experience';
  title: string;
  period: string;
  description: string;
  order: number;
}

const Resume: React.FC = () => {

  const { data: resumes, isLoading } = useQuery<ResumeData[]>({
    queryKey: ['resumes'],
    queryFn: () => fetch(`${BASE_URL}/api/resumes`).then(res => res.json()),
  });

  if(isLoading) return <Loading />;

  const education = resumes?.filter(item => item.type === 'education')
                            .sort((a, b)=> a.order - b.order);

  const experience = resumes?.filter(item => item.type === 'experience')
                             .sort((a, b) => a.order - b.order);

  return (
    <article className={styles.resumeContainer}>
      <header>
        <h2 className={styles.title}>Resume</h2>
        <div className={styles.titleLine}></div>
      </header>
      
      {/* Education */}
      <TimelineSection 
        title= "Education"
        icon={<IoBookOutline />}
        data={education || []}
      />

      {/* Experience */}
      <TimelineSection 
        title= "Experience"
        icon={<IoBriefcaseOutline />}
        data={experience || []}
      />
    </article>

  );
};

// 섹션 컴포넌트
const TimelineSection = ({ title, icon, data }: { title: string, icon: React.ReactNode, data: ResumeData[] }) => (
  <section className={styles.timeline}>
    <div className={styles.titleWrapper}>
      <div className={styles.iconBox}>{icon}</div>
      <h3 className={styles.sectionTitle}>{title}</h3>
    </div>
    <ol className={styles.timelineList}>
      {data.map(item => (
        <TimelineItem 
          key={item.id}
          title={item.title}
          date={item.period}
          desc={item.description}
        />
      ))}
    </ol>
  </section>
);

// 타임라인 Item 컴포넌트
const TimelineItem = ({ title, date, desc }: { title: string, date: string, desc: string }) => (
  <li className={styles.timelineItem}>
    <h4 className={styles.itemTitle}>{title}</h4>
    <span className={styles.itemDate}>{date}</span>
    <p className={styles.itemText}>{desc}</p>
  </li>
);

export default Resume;