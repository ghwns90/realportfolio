import { useQuery } from '@tanstack/react-query';
import { fetchPublicProfile } from '../api/public';

export const useProfile = () => {

  return useQuery({
    queryKey:['publicProfile'],
    queryFn: fetchPublicProfile,
    staleTime: 1000 * 60 * 5, // 5분동안은 신선한 데이터로 간주
  });
};

