import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { filter, switchMap, take, tap } from 'rxjs';
import {
  AppRole,
  CreateMemberInterface,
  MemberInterface,
} from '../../../../../../interfaces/member.interface';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { AppManagerService } from '../../services/app/app.manager';
import {
  CreateMemberComponent,
  MemberDialogDataInterface,
} from './components/create-member/create-member.component';
import { DeleteMemberComponent } from './components/delete-member/delete-member.component';

@Component({
  selector: 'app-members',
  imports: [ButtonModule, ProgressSpinnerModule, TableModule, TagModule],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss',
})
export class MembersComponent {
  #appManager = inject(AppManagerService);
  #authService = inject(AuthService);
  #dialogService = inject(DialogService);
  #toastService = inject(MessageService);

  members = toSignal(this.#appManager.members$);
  user = toSignal(this.#authService.user$);

  isAdmin = computed(() => this.user()?.role === 'ADMIN');

  createMember() {
    this.#authService
      .getUsers()
      .pipe(
        take(1),
        switchMap((users) =>
          this.#dialogService.open(CreateMemberComponent, {
            header: 'Add member',
            data: {
              users,
              members: this.members() ?? [],
            } satisfies MemberDialogDataInterface,
          }).onClose
        ),
        filter((member): member is CreateMemberInterface => Boolean(member)),
        switchMap((member) => this.#appManager.createMember(member)),
        tap(() =>
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The member has been added',
          })
        )
      )
      .subscribe();
  }

  editMember(member: MemberInterface) {
    this.#dialogService
      .open(CreateMemberComponent, {
        header: 'Edit member',
        data: {
          users: [],
          members: this.members() ?? [],
          member,
        } satisfies MemberDialogDataInterface,
      })
      .onClose.pipe(
        filter((updated): updated is { role: AppRole } => Boolean(updated)),
        switchMap(({ role }) => this.#appManager.updateMember(member.id, role)),
        tap(() =>
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The member has been updated',
          })
        )
      )
      .subscribe();
  }

  deleteMember(member: MemberInterface) {
    this.#dialogService
      .open(DeleteMemberComponent, { header: 'Remove member', data: member })
      .onClose.pipe(
        filter((remove): remove is true => Boolean(remove)),
        switchMap(() => this.#appManager.deleteMember(member.id)),
        tap(({ message }) =>
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
          })
        )
      )
      .subscribe();
  }
}
