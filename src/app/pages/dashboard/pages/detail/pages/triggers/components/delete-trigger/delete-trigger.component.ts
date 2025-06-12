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
import { TriggerInterface } from '../../../../../../../../interfaces/trigger.interface';
import { deleteAppNameValidator } from '../../../../validators/delete-app.validator';

@Component({
  selector: 'app-delete-trigger',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './delete-trigger.component.html',
  styleUrl: './delete-trigger.component.scss',
})
export class DeleteTriggerComponent {
  ref = inject(DynamicDialogRef);

  trigger: TriggerInterface = inject(DialogService).getInstance(this.ref).data;

  deleteForm = new FormGroup({
    name: new FormControl<string | null>('', [
      Validators.required,
      deleteAppNameValidator(this.trigger.name),
    ]),
  });
}
