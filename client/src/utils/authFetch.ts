import { BASE_URL } from '../constants/api';

export const authFetch = async (url: string, options: RequestInit = {}) => {

  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  let response = await fetch(url, { ...options, headers });

  if(response.status === 401) {
    console.log('🔄 액세스 토큰 만료 재발급 시도 중..');
  
    try {
      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, { method: 'POST' });

      if(refreshRes.ok){
        const data = await refreshRes.json();
        const newAccessToken = data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        console.log('✅ 토큰 갱신 성공!');

        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        response = await fetch(url, { ...options, headers: newHeaders });
      }else{
        console.error('❌ 리프레시 토큰도 만료됨. 로그아웃 처리.');
        localStorage.removeItem('accessToken');
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('토큰 갱신 중 네트워크 오류', error);
      window.location.href = '/admin/login';
    }
  }

  return response;

  
}