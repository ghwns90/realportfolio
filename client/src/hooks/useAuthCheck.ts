import { useState, useEffect } from "react";
import { authFetch } from "../utils/authFetch";
import { BASE_URL } from "../constants/api";

export const useAuthCheck = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=> {
    console.log("👉 useAuthCheck: 훅 실행됨!");
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {

    const token = localStorage.getItem('accessToken');

    // 1. 토큰이 아예 없으면 리프레시 시도조차 할 필요 없음
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      // 서버애 검증 요청
      const res = await authFetch(`${BASE_URL}/api/auth/verify`);
      
      if(res.ok){
        console.log("✅ 인증 성공");
        setIsLoggedIn(true);
      }else {
        throw new Error("만료됨");
      }

    } catch (err) {

      console.log("🔄 토큰 만료, 리프레시 시도...", err);

      try {
        const res = await fetch(`${BASE_URL}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('accessToken', data.accessToken);
          // 재검증 혹은 상태 업데이트
          setIsLoggedIn(true);
        } else {
          throw new Error("리프레시 실패");
        }
      }catch(refreshErr){
        console.error("최종 인증 실패", refreshErr);
        localStorage.removeItem('accessToken');
        setIsLoggedIn(false);
      }
    }finally{
      setIsLoading(false);
    }

  }

  return { isLoggedIn, isLoading };
};