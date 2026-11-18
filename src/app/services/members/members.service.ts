import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  AppRole,
  CreateMemberInterface,
  MemberInterface,
} from '../../interfaces/member.interface';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  #http = inject(HttpClient);

  getMembers(appId: string) {
    return this.#http.get<MemberInterface[]>(
      `${environment.apiUrl}/apps/${appId}/members`
    );
  }

  createMember(appId: string, member: CreateMemberInterface) {
    return this.#http.post<MemberInterface>(
      `${environment.apiUrl}/apps/${appId}/members`,
      member
    );
  }

  updateMember(appId: string, memberId: number, role: AppRole) {
    return this.#http.put<MemberInterface>(
      `${environment.apiUrl}/apps/${appId}/members/${memberId}`,
      { role }
    );
  }

  deleteMember(appId: string, memberId: number) {
    return this.#http.delete<MessageInterface>(
      `${environment.apiUrl}/apps/${appId}/members/${memberId}`
    );
  }
}
