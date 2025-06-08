import { useQuery } from '@tanstack/react-query';
import axios from '../utils/api';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await axios.get('/users/me');
      return res.data;
    },
    staleTime: 5,
  });
};
