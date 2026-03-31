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
import { PasswordModule } from 'primeng/password';
import { UserInterface } from '../../../../../../interfaces/auth.interface';

@Component({
  selector: 'app-create-user',
  imports: [
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    MessageModule,
    PasswordModule,
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent {
  ref = inject(DynamicDialogRef);
  data?: UserInterface = inject(DialogService).getInstance(this.ref).data;

  userForm = new FormGroup({
    name: new FormControl<string | null>(this.data?.name ?? null, [
      Validators.required,
    ]),
    email: new FormControl<string | null>(this.data?.email ?? null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(
      { value: null, disabled: Boolean(this.data) },
      [Validators.required]
    ),
  });
}
