import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLockClosedOutline } from 'react-icons/io5';
import styles from './AdminLogin.module.css';
import { BASE_URL } from '../constants/api';

const AdminLogin: React.FC = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res= await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
        credentials: 'include',
      });

      const data = await res.json();

      if(res.ok){
        localStorage.setItem('accessToken', data.accessToken);
        navigate('/admin/dashboard');
      }else{ 
        alert('비밀번호가 틀렸습니다.');
      }
    
    } catch (error) {
      console.error(error);
      alert('로그인 서버에 연결할 수 없습니다.');
    };
  }
    

    return (
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.iconWrapper}>
            <IoLockClosedOutline />
          </div>
          <h2 className={styles.title}>Admin Access</h2>
          <p className={styles.subtitle}>Authorized Personnel Only</p>
          
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <button type="submit" className={styles.loginBtn}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
};

export default AdminLogin;