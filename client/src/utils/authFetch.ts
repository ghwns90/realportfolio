import { BASE_URL } from '../constants/api';

interface AuthFetchOptions extends RequestInit {
  isFormData?: boolean;
}

export const authFetch = async (url: string, options: AuthFetchOptions = {}) => {

  const { isFormData, ...fetchOptions } = options;
  const accessToken = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  //  FormData를 보낼 때는 브라우저가 자동으로 Content-Type을 정해야 하므로 
  // 'application/json'을 헤더에 넣으면 안 됨
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  let response = await fetch(url, { ...fetchOptions, headers });

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

        response = await fetch(url, { ...fetchOptions, headers: newHeaders });
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