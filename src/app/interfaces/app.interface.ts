export type AppInterface = RepositoryAppInterface | ImageAppInterface;

export interface RepositoryAppInterface {
  id: string;
  name: string;
  mode: 'REPOSITORY';
  description: string | null;
  repository: string;
  branch: string;
  image: null;
  status: string;
  contextPath?: string;
  filePath?: string;
  tokenId: string | null;
}

export interface ImageAppInterface {
  id: string;
  name: string;
  mode: 'IMAGE';
  description: string | null;
  repository: null;
  branch: null;
  image: string;
  status: string;
  contextPath: null;
  filePath: null;
  tokenId: string | null;
}
