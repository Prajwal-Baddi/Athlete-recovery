import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

export const reportKeys = {
  all: () => ['reports'],
  detail: (id) => ['reports', id],
};

export const useReports = () =>
  useQuery({
    queryKey: reportKeys.all(),
    queryFn: async () => {
      try {
        const response = await api.get('/reports');
        return response?.data?.data || [];
      } catch (error) {
        console.error('Error fetching reports from API, falling back to empty array', error);
        return [];
      }
    },
  });

export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => api.post('/reports/generate', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all() });
    },
  });
};
