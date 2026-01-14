import React from 'react';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
  return (
    <article>
      <header>
        <h2 className={styles.title}>Contact</h2>
        <div className={styles.titleLine}></div>
      </header>

      {/* 지도 영역 (일단 박스만!) */}
      <section className={styles.mapbox}>
        <div className={styles.mapPlaceholder}>
          Google Map Placeholder
        </div>
      </section>

      {/* 문의 폼 */}
      <section className={styles.contactForm}>
        <h3 className={styles.formTitle}>Contact Form</h3>
        <form className={styles.form}>
          <div className={styles.inputWrapper}>
            <input type="text" placeholder="Full name" className={styles.formInput} />
            <input type="email" placeholder="Email address" className={styles.formInput} />
          </div>
          <textarea placeholder="Your Message" className={styles.formInput} rows={5}></textarea>
          <button type="submit" className={styles.formBtn}>Send Message</button>
        </form>
      </section>
    </article>
  );
};

export default Contact;