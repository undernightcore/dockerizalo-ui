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
import { TokenInterface } from '../../../../../../interfaces/token.interface';

@Component({
  selector: 'app-create-token',
  imports: [
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    MessageModule,
    PasswordModule,
  ],
  templateUrl: './create-token.component.html',
  styleUrl: './create-token.component.scss',
})
export class CreateTokenComponent {
  ref = inject(DynamicDialogRef);
  data?: TokenInterface = inject(DialogService).getInstance(this.ref).data;

  tokenForm = new FormGroup({
    name: new FormControl<string | null>(
      this.data?.name || null,
      Validators.required
    ),
    username: new FormControl<string | null>(
      this.data?.username || null,
      Validators.required
    ),
    password: new FormControl<string | null>(
      this.data?.password || null,
      Validators.required
    ),
  });
}
