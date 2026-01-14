import React from 'react';
import { IoBookOutline, IoBriefcaseOutline } from 'react-icons/io5';
import styles from './Resume.module.css';

const Resume: React.FC = () => {
  return (
    <article>
      <header>
        <h2 className={styles.title}>Resume</h2>
        <div className={styles.titleLine}></div>
      </header>
      
      <section className={styles.timeline}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconBox}>
            <IoBookOutline />
          </div>
          <h3 className={styles.sectionTitle}>Education</h3>
        </div>
        <ol className={styles.timelineList}>
          <TimelineItem 
            title= "University of Life"
            date= "2015 - 2019"
            desc= "Computer Science & Engineering"
          />
          <TimelineItem 
            title="High School of Tech" 
            date="2012 — 2015" 
            desc="General IT Curriculum" 
          />
        </ol>
      </section>
      {/* Experience 섹션 */}
      <section className={styles.timeline}>
        <div className={styles.titleWrapper}>
          <div className={styles.iconBox}><IoBriefcaseOutline /></div>
          <h3 className={styles.sectionTitle}>Experience</h3>
        </div>
        <ol className={styles.timelineList}>
          <TimelineItem 
            title="Creative Director" 
            date="2022 — Present" 
            desc="Leading the design team and managing large scale projects." 
          />
          <TimelineItem 
            title="Web Designer" 
            date="2020 — 2022" 
            desc="Designed and developed various responsive web applications." 
          />
        </ol>
      </section>
    </article> 
  )
}

// 타임라인 아이템 컴포넌트
const TimelineItem = ({ title, date, desc }: { title: string, date: string, desc: string }) => (
  <li className={styles.timelineItem}>
    <h4 className={styles.itemTitle}>{title}</h4>
    <span className={styles.itemDate}>{date}</span>
    <p className={styles.itemText}>{desc}</p>
  </li>
);

export default Resume;