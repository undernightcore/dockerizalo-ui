export interface AppInterface {
  id: string;
  name: string;
  description: string | null;
  repository: string;
  branch: string;
  status: string;
  contextPath?: string;
  filePath?: string;
  tokenId: string | null;
}
