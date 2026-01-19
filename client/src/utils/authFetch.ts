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
      const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, { method: 'POST' , credentials: 'include'});

      if(refreshRes.ok){
        const data = await refreshRes.json();
        const newAccessToken = data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        console.log('✅ 토큰 갱신 성공!');

        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        response = await fetch(url, { ...fetchOptions, headers: retryHeaders });
      }else{

        throw new Error('Refresh token expired');

      }
    } catch (err) {
      localStorage.removeItem('accessToken');
      window.location.href = '/admin/login';
      throw err;
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response;

  
}