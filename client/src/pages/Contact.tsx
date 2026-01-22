import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { BASE_URL } from '../constants/api';
import styles from './Contact.module.css';

const Contact: React.FC = () => {

  const [formData, setFormData] = useState({
    name: '', email: '', message: ''
  });

  const mutation = useMutation({
    mutationFn: async (newMsg: typeof formData) => {

      const res = await fetch(`${BASE_URL}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg),
      });

      if(!res.ok) throw new Error('Server Error');

      return res.json();
    },
    onSuccess: () => {
      alert('메일을 보냈습니다.');
      setFormData({ name: '', email: '', message: '' });
    },
    onError: () => alert('Faild to send message. Please try again')  
  });

  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if(!formData.name || !formData.email || !formData.message) return alert('내용을 채워주세요');

    mutation.mutate(formData); 
  };

  return (
    <article className={styles.contactContainer}>
      <header>
        <h2 className={styles.title}>Contact</h2>
        <div className={styles.titleLine}></div>
      </header>

      {/* 지도 영역 (일단 박스만!) */}
      <section className={styles.mapbox}>
        <iframe 
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2665.76471593368!2d129.09372123103466!3d35.13070718366123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568ec5e4feeb18f%3A0x5fa80d0ce105e488!2z67aA7IKw67CV66y86rSA!5e0!3m2!1sko!2skr!4v1769072234371!5m2!1sko!2skr" 
          width="100%" 
          height="100%" 
          style={{border:0}} 
          allowFullScreen 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

      {/* 문의 폼 */}
      <section className={styles.contactForm}>
        <h3 className={styles.formTitle}>Contact Form</h3>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input 
              type="text" placeholder="Full name" 
              className={styles.formInput} value={formData.name}
              onChange={(e)=> setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" placeholder="Email address" 
              className={styles.formInput} value={formData.email}
              onChange={(e)=> setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <textarea 
            placeholder="Your Message" className={styles.formInput} 
            rows={5} value={formData.message}
            onChange={(e)=> setFormData({...formData, message: e.target.value})}
          ></textarea>
          <button type="submit" className={styles.formBtn} disabled={mutation.isPending}>
            {mutation.isPending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </section>
    </article>
  );
};

export default Contact;