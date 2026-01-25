import React, { useState, useEffect } from 'react';
import { authFetch } from '../../utils/authFetch';
import { FormInput, FormTextArea } from '../../components/common/FormInput';
import { FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import styles from './Profile.module.css';
import { BASE_URL } from '../../constants/api';
import Loading from '../Loading';

type StackCategory = 'frontend' | 'backend' | 'devops';

interface TechStack {
  frontend: string[];
  backend: string[];
  devops: string[];
}

const Profile: React.FC = () => {
  // 1. 기본 정보 State
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    location: '',
    description: '',
    avatarUrl: '',
    techStack: {frontend: [], backend: [], devops: []} as TechStack,
    socials: { github: '', instagram: '', blog: '' } as Record<string, string>,
  });

  // 2. 비밀번호 State
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // 기술 스택 입력용 임시 State
  const [stackInput, setStackInput] = useState({
    frontend: '',
    backend: '',
    devops: '',
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await authFetch(`${BASE_URL}/api/admin/profile`);

      if(res.ok){
        const data = await res.json();
        setProfile({
          ...data, 
          techStack: data.techStack ?? {frontend: [], backend: [], devops: []}
        });
      }
      
    } catch (error) {
      console.error("프로필 로딩 실패",error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=> {
    fetchProfile();
  },[]);

  //기술 스택 추가 (Enter 키)
  const handleStackKeyDown = (e: React.KeyboardEvent, category: StackCategory) => {
    if(e.key === 'Enter' && stackInput[category].trim()){
      e.preventDefault();
      const value = stackInput[category].trim();

      if(!profile.techStack[category].includes(value)) {
        setProfile({
          ...profile,
          techStack: {
            ...profile.techStack,
            [category]: [...profile.techStack[category], value]
          }
        });
      }

      setStackInput({
        ...stackInput, [category]: ''
      });      
    }
  };
  // 기술 스택 삭제
  const removeStack = (category: StackCategory, tag: string) => {
    setProfile({
      ...profile,
      techStack: {
        ...profile.techStack,
        [category]: profile.techStack[category].filter(t => t !== tag),
      }
    });
  };
  // 저장 API 연결(Update)
  const handleSave = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/api/admin/profile`, {
        method: 'PUT',
        body: JSON.stringify(profile), 
      });

      if(res.ok){
        alert('프로필이 성공적으로 저장되었습니다');
      }else{
        const errData = await res.json();
        alert(`저장 실패 : ${errData.message}`)
      }

    } catch (error) {
      console.error("저장 중 에러", error);
    }
  };

  //비밀번호 변경 업데이트
  const handlePasswordUpdate = async () => {
    // 유효성 검사
    if(!password.current || !password.new) return alert('비밀번호를 입력하세요.');
    if(password.new !== password.confirm) return alert('새 비밀번호가 일치하지 않습니다.');

    try {
      const res = await authFetch(`${BASE_URL}/api/admin/password`, {
        method: 'PUT',
        body: JSON.stringify({ current: password.current, new: password.new, confirm: password.confirm}),
      });

      if(res.ok) {
        alert('비밀번호가 변경되었습니다. 다시 로그인해주세요');
        setPassword({ current: '', new: '', confirm: '' });
      }else {
        const err = await res.json();
        alert(err.message || '변경 실패');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 프로필 이미지 변경 핸들러
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('avatar', file); // 'avatar'는 서버의 upload.single() 의 'avatar'와 일치해야함

    try {
      const res = await fetch(`${BASE_URL}/api/admin/profile/avatar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: formData, // formData는 JSON.stringify 하지않음
      });

      if(res.ok){
        const data = await res.json();
        // profile state 업데이트하여 화면에 즉시 반영
        setProfile({...profile, avatarUrl: data.url});
      }

    } catch (error) {
      console.error(error);
    }
  }

  if(loading) return <Loading />

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Profile Settings</h1>
        <button className={styles.saveBtn} onClick={handleSave}>
          <FaSave /> Save Changes
        </button>
      </header>

      <div className={styles.grid}>
        {/* --- 왼쪽: 프로필 사진 & 기본 정보 & 비밀번호 --- */}
        <div className={styles.column}>
          {/* 1. 프로필 사진 섹션 */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Avatar</h3>
            <div className={styles.avatarWrapper}>
              <div className={styles.avatarPreview}>
                <img 
                  src={profile.avatarUrl || '/images/my-avatar.png'}
                  alt="Profile" 
                />
                <label className={styles.uploadBtn}>
                  <FaCamera />
                  <input type="file" hidden accept="image/*" onChange={handleImageChange}/>
                </label>
              </div>
            </div>
          </section>

          {/* 2. 기본 정보 섹션 */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Basic Info</h3>
            <div className={styles.formGap}>
              <FormInput 
                label="Name" 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})}
              />
              <FormInput 
                label="Email" 
                type="email"
                value={profile.email} 
                onChange={e => setProfile({...profile, email: e.target.value})}
              />
              <FormInput 
                label="Phone" 
                value={profile.phone} 
                onChange={e => setProfile({...profile, phone: e.target.value})}
              />
              <FormInput 
                label="Location" 
                value={profile.location} 
                onChange={e => setProfile({...profile, location: e.target.value})}
              />
            </div>
          </section>

          {/* 3. 비밀번호 변경 섹션 */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Password</h3>
            <div className={styles.formGap}>
              <FormInput 
                label="Current" type="password"
                value={password.current}
                onChange={e => setPassword({...password, current: e.target.value})}
              />
              <FormInput 
                label="New" type="password"
                value={password.new}
                onChange={e => setPassword({...password, new: e.target.value})}
              />
              <FormInput 
                label="Confirm" type="password" 
                value={password.confirm} 
                onChange={e => setPassword({...password, confirm: e.target.value})} 
              />

              <button className={styles.subBtn} onClick={handlePasswordUpdate}>
                Update Password
              </button>
            </div>
          </section>
        </div>

        {/* --- 오른쪽: About Me & 기술 스택 --- */}
        <div className={styles.column}>
          {/* 4. About Me 섹션 */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>About Me</h3>
            <FormTextArea 
              label="Biography"
              value={profile.description}
              onChange={e => setProfile({...profile, description: e.target.value})}
              placeholder="Write a short introduction..."
              style={{ minHeight: '200px' }}
            />
          </section>

          {/* 5. 기술 스택 관리 섹션 */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Tech Stack</h3>
            
            {/* Frontend */}
            {(['frontend', 'backend', 'devops'] as StackCategory[]).map(cat => (
              <div key={cat} className={styles.stackGroup}>
                <label className={styles.stackLabel}>{cat.toUpperCase()}</label>
                <div className={styles.tagContainer}>
                  {profile.techStack[cat].map(tag => (
                    <span key={tag} className={`${styles.tag} ${styles[cat]}`}>
                      {tag} <FaTimes onClick={()=> removeStack(cat, tag)}/>
                    </span>
                  ))}
                  <input
                    placeholder="+ Add tag"
                    value={stackInput[cat]}
                    onChange={e => setStackInput({...stackInput, [cat]: e.target.value})}
                    onKeyDown={e => handleStackKeyDown(e, cat)}
                    className={styles.tagInput} 
                  />
                </div>
              </div>
            ))}
          </section>
          {/* 6. 소셜 관리 세션 */}
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Social Links</h3>
            <div className={styles.formGap}>
              <FormInput 
                label="GitHub URL" 
                placeholder="https://github.com/..."
                value={profile.socials?.github || ''}
                onChange={e => setProfile({
                  ...profile, 
                  socials: { ...profile.socials, github: e.target.value }
                })}
              />
              <FormInput 
                label="Instagram URL" 
                placeholder="https://instagram.com/..."
                value={profile.socials?.instagram || ''}
                onChange={e => setProfile({
                  ...profile, 
                  socials: { ...profile.socials, instagram: e.target.value }
                })}
              />
              <FormInput 
                label="Blog URL" 
                placeholder="https://velog.io/@..."
                value={profile.socials?.blog || ''}
                onChange={e => setProfile({
                  ...profile, 
                  socials: { ...profile.socials, blog: e.target.value }
                })}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;