export interface AppInterface {
  id: string;
  name: string;
  description: string | null;
  repository: string;
  branch: string;
  status: string;
  tokenId: string | null;
}
