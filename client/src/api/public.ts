import { BASE_URL } from '../constants/api';
// 프로필 조회
export const fetchPublicProfile = async () => {

  const res = await fetch(`${BASE_URL}/api/public/profile`);
  const data = await res.json();

  console.log("⚛️ React Query가 받은 진짜 데이터:", data);
  
  if(!res.ok) throw new Error('네트워크 응답이 좋지 않습니다');

  return data;
}