import Loading from '../components/Loading';
import { useProfile } from '../hooks/useProfile';
import styles from './About.module.css';

const About: React.FC = () => {
  const { data: profile , isLoading } = useProfile();

  // 반복되는 카드 구조를 위해 배열 정의
  const categories: { key: 'frontend' | 'backend' | 'devops'; title: string; icon: string }[] = [
    { key: 'frontend', title: '프론트', icon: '🌐' },
    { key: 'backend', title: '백', icon: '🖥️' },
    { key: 'devops', title: '기타', icon: '🚀' },
  ];
  
  if (!profile) return null;

  if(isLoading) return <Loading />;

  return (
    <article className={styles.aboutPage}>
      <header>
        <h2 className={styles.articleTitle}>About Me</h2>
        <div className={styles.hLine}></div>
      </header>

      <section className={styles.description} style={{ marginBottom: '5rem' }}>
        {profile?.description?.split('\n').map((line: string, i: number) => (
          <p key={i}>{line}</p>
        ))}
      </section>

      <h3 className={styles.serviceTitle}>What I'm Doing</h3>
      <ul className={styles.serviceList}>
        {categories.map((cat)=> (
          <li key={cat.key} className={styles.serviceItem}>
            <div className={styles.serviceIconBox}>{cat.icon}</div>
            <div className={styles.serviceContentBox}>
              <h4 className={styles.serviceItemTitle}>{cat.title}</h4>
              <div className={styles.userTagWrapper}>
                {profile.techStack?.[cat.key]?.map((tag: string) => (
                  <span key= {tag} className={`${styles.userTag} ${styles[cat.key]}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default About;