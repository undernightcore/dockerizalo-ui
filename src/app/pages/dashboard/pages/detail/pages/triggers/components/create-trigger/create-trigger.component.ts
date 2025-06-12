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

@Component({
  selector: 'app-create-trigger',
  imports: [
    MessageModule,
    FloatLabelModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
  ],
  templateUrl: './create-trigger.component.html',
  styleUrl: './create-trigger.component.scss',
})
export class CreateTriggerComponent {
  ref = inject(DynamicDialogRef);

  trigger?: Partial<TriggerInterface> = inject(DialogService).getInstance(
    this.ref
  ).data;

  createForm = new FormGroup({
    name: new FormControl<string | null>(
      this.trigger?.name ?? null,
      Validators.required
    ),
  });
}
