import axios from 'axios';

import { ICreateJob, IGetJobList, IRequestList } from '@/types/home';

const baseUrl = process.env.BASE_URL;

export const apiGetJobList = async (params: {
  page: number;
  pageSize: number;
  jobName: string;
}) => {
  const res = await axios.get<IRequestList<IGetJobList>>(`${baseUrl}/job/asPage`, { params });
  return res;
};

export const apiGetJobDetail = async (id: string) => {
  const res = await axios.get<IGetJobList[]>(`${baseUrl}/job/byID`, {
    params: {
      id,
    },
  });
  return res;
};

export const apiCreateJob = async (data: ICreateJob) => {
  const res = await axios.post(`${baseUrl}/job`, data);
  return res;
};

export const apiDeleteJob = async (id: string) => {
  const res = await axios.delete(`${baseUrl}/job`, {
    params: {
      id,
    },
  });
  return res;
};

export const apiUpdateJob = async (data: ICreateJob) => {
  const res = await axios.put(`${baseUrl}/job`, data);
  return res;
};

export const apiGetImageZipFile = async (jobID: string) => {
  const res = await axios.get(`${baseUrl}/job/pics`, {
    params: {
      jobID,
    },
    responseType: 'blob',
  });
  return res;
};

export const apiGetCameraList = async () => {
  const res = await axios.get(`${baseUrl}/camera`);
  return res;
};

export const apiGetJobProgress = async (jobID: string) => {
  const res = await axios.get(`${baseUrl}/job/progress`, {
    params: {
      jobID,
    },
  });
  return res;
};
