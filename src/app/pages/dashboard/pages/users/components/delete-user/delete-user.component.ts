import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { UserInterface } from '../../../../../../interfaces/auth.interface';
import { deleteUserEmailValidator } from '../../validators/delete-user.validator';

@Component({
  selector: 'app-delete-user',
  imports: [
    MessageModule,
    FloatLabel,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.scss',
})
export class DeleteUserComponent {
  ref = inject(DynamicDialogRef);
  user: UserInterface = inject(DialogService).getInstance(this.ref).data;

  deleteForm = new FormGroup({
    email: new FormControl<string | null>('', [
      Validators.required,
      deleteUserEmailValidator(this.user.email),
    ]),
  });
}
