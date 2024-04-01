export interface IGetJobList {
  id: string;
  jobName: string;
  status: 'waiting' | 'done' | 'working' | 'failed';
  jobPeriodStart: string;
  jobPeriodEnd: string;
  camera: string;
  description: string;
  results: string[];
}

export interface ICreateJob {
  jobName: string;
  jobPeriodStart: Date | string;
  jobPeriodEnd: Date | string;
  camera: string;
  description: string;
  status: string;
}

export interface IRequestList<t> {
  data: t[];
  totalCount: number;
}
