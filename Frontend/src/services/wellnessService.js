import { useQuery } from '@tanstack/react-query';
import api from './api';

export const useWellnessLogs = () =>
  useQuery({
    queryKey: ['wellness'],
    queryFn: async () => {
      const { data } = await api.get(
        '/wellness/me'
      );

      return data.data;
    },
  });