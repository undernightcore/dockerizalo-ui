export type AppRole = 'VIEWER' | 'EDITOR';

export interface MemberUserInterface {
  id: number;
  email: string;
  name: string;
}

export interface MemberInterface {
  id: number;
  role: AppRole;
  createdAt: string;
  user: MemberUserInterface;
}

export interface CreateMemberInterface {
  userId: number;
  role: AppRole;
}
