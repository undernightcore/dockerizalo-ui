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
import { TokenInterface } from '../../../../../../interfaces/token.interface';
import { deleteTokenNameValidator } from '../../validators/delete-token.validator';

@Component({
  selector: 'app-delete-token',
  imports: [
    MessageModule,
    FloatLabel,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './delete-token.component.html',
  styleUrl: './delete-token.component.scss',
})
export class DeleteTokenComponent {
  ref = inject(DynamicDialogRef);

  token: TokenInterface = inject(DialogService).getInstance(this.ref).data;

  deleteForm = new FormGroup({
    name: new FormControl<string | null>('', [
      Validators.required,
      deleteTokenNameValidator(this.token.name),
    ]),
  });
}
