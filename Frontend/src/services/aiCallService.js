import api from './api';

export const startRecoveryCall = async (
  phoneNumber
) => {
  const { data } = await api.post(
    '/ai-calls/start',
    {
      phoneNumber,
    }
  );

  return data;
};