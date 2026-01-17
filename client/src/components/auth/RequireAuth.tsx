import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import Loading from '../Loading';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthCheck();
  const location = useLocation();

  // 검사 중이면 로딩 표시
  if(isLoading) {
    return <Loading />
  }

  if(!isLoggedIn) {
    return <Navigate to = "/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>
}

export default RequireAuth;