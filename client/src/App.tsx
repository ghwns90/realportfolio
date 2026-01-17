import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import About from './pages/About';       
import Portfolio from './pages/Portfolio'; 
import Resume from './pages/Resume';     
import Contact from './pages/Contact';    
import AdminLogin from './pages/AdminLogin'; 
import AdminLayout from './components/admin/AdminLayout';
import RequireAuth from './components/auth/RequireAuth';
import Profile from './components/admin/Profile';
import Projects from './components/admin/Projects';

const App: React.FC = () => {

  return (    
    <BrowserRouter>
      <Routes>
        {/* 로그인 */}
        <Route path="/admin/login" element={<AdminLogin />}/>
        {/* 메인페이지 */}
        <Route path="/" element={<MainLayout />}>        
          <Route index element={<Navigate to="/about" replace />} />
          <Route path="about" element={<About />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="resume" element={<Resume />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        {/* 관리자 */}
        <Route path="/admin" element={<RequireAuth><AdminLayout/></RequireAuth>}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<div><h1>대시보드 메인</h1><p>여기 차트 같은 거 넣을 예정</p></div>} />
          
          {/* /admin/profile */}
          <Route path="profile" element={<Profile />}/>
          
          {/* /admin/projects */}
          <Route path="projects" element={<Projects />} />

          {/* /admin/resume */}
          <Route path="resume" element={<div><h1>이력서 관리</h1></div>} />
        </Route>
      </Routes>
    </BrowserRouter>  
  )
}

export default App
