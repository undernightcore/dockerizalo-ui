export interface BuildInterface {
  id: string;
  branch: string;
  log: string;
  manual: boolean;
  createdAt: string;
  updatedAt: string;
  finishedAt?: string;
  status: 'BUILDING' | 'FAILED' | 'SUCCESS';
  appId: string;
}
