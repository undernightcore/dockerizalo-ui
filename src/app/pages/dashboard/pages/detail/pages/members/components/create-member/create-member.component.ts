import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { UserInterface } from '../../../../../../../../interfaces/auth.interface';
import {
  AppRole,
  CreateMemberInterface,
  MemberInterface,
} from '../../../../../../../../interfaces/member.interface';

export interface MemberDialogDataInterface {
  users: UserInterface[];
  members: MemberInterface[];
  member?: MemberInterface;
}

@Component({
  selector: 'app-create-member',
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    ButtonModule,
    MessageModule,
    SelectModule,
  ],
  templateUrl: './create-member.component.html',
  styleUrl: './create-member.component.scss',
})
export class CreateMemberComponent {
  ref = inject(DynamicDialogRef);

  data: MemberDialogDataInterface = inject(DialogService).getInstance(
    this.ref
  ).data;

  member = this.data.member;

  users = this.data.users.filter(
    (user) =>
      !this.data.members.some(
        ({ user: appMember }) => appMember.id === user.id
      )
  );

  roles: { label: string; value: AppRole }[] = [
    { label: 'Viewer', value: 'VIEWER' },
    { label: 'Editor', value: 'EDITOR' },
  ];

  memberForm = new FormGroup({
    userId: new FormControl<number | null>(
      this.member?.user.id ?? null,
      Validators.required
    ),
    role: new FormControl<AppRole>(this.member?.role ?? 'VIEWER', {
      validators: Validators.required,
      nonNullable: true,
    }),
  });

  save() {
    const userId =
      this.member?.user.id ?? this.memberForm.controls.userId.value;

    if (userId === null) return;

    this.ref.close({
      userId,
      role: this.memberForm.controls.role.value,
    } satisfies CreateMemberInterface);
  }
}
