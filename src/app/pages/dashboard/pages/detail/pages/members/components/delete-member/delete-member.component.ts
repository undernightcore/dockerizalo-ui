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
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MemberInterface } from '../../../../../../../../interfaces/member.interface';
import { deleteAppNameValidator } from '../../../../validators/delete-app.validator';

@Component({
  selector: 'app-delete-member',
  imports: [
    MessageModule,
    FloatLabelModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './delete-member.component.html',
  styleUrl: './delete-member.component.scss',
})
export class DeleteMemberComponent {
  ref = inject(DynamicDialogRef);

  member: MemberInterface = inject(DialogService).getInstance(this.ref).data;

  deleteForm = new FormGroup({
    name: new FormControl<string | null>('', [
      Validators.required,
      deleteAppNameValidator(this.member.user.name),
    ]),
  });
}
