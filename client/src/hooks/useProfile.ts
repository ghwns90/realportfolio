import { useQuery } from '@tanstack/react-query';
import { fetchPublicProfile } from '../api/public';

export const useProfile = () => {

  return useQuery({
    queryKey:['publicProfile'],
    queryFn: fetchPublicProfile,
  });
};

