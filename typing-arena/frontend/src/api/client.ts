import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

export const fetchRandomText = async (params: Record<string, string | number | undefined>) => {
  const res = await api.get('/texts/random', { params });
  return res.data.text as string;
};

export const postResult = async (payload: any) => {
  const res = await api.post('/results', payload);
  return res.data;
};

export const fetchTrainingPlan = async (userId: string) => {
  const res = await api.get('/training/plan', { params: { userId } });
  return res.data.plan;
};

export const fetchLessons = async (userId: string) => {
  const res = await api.get('/lessons', { params: { userId } });
  return res.data.lessons;
};

export const fetchStats = async (userId: string) => {
  const res = await api.get('/stats/summary', { params: { userId } });
  return res.data;
};

export const fetchLeaderboards = async (params: Record<string, string>) => {
  const res = await api.get('/leaderboards', { params });
  return res.data.leaderboard;
};
