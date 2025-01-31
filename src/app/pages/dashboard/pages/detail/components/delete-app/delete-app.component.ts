import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AppInterface } from '../../../../../../interfaces/app.interface';
import { deleteAppNameValidator } from '../../validators/delete-app.validator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-delete-app',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ButtonModule,
    FloatLabelModule,
    CheckboxModule,
  ],
  templateUrl: './delete-app.component.html',
  styleUrl: './delete-app.component.scss',
})
export class DeleteAppComponent {
  ref = inject(DynamicDialogRef);

  app: AppInterface = inject(DialogService).getInstance(this.ref).data;

  deleteForm = new FormGroup({
    name: new FormControl<string | null>('', [
      Validators.required,
      deleteAppNameValidator(this.app.name),
    ]),
    force: new FormControl<boolean | null>(true),
  });
}
