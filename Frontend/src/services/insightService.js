import { useQuery } from '@tanstack/react-query';
import api from './api';

export const insightKeys = {
  all: () => ['insights'],
};

export const useAIInsights = () =>
  useQuery({
    queryKey: insightKeys.all(),
    queryFn: async () => {
      try {
        const response = await api.get('/insights');
        return response?.data?.data || [];
      } catch (error) {
        console.error('Error fetching AI insights from API, falling back to empty array', error);
        return [];
      }
    },
  });
