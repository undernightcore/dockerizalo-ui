import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { urlValidator } from '../../../../validators/url.validator';

@Component({
  selector: 'app-create-app',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ButtonModule,
    FloatLabelModule,
  ],
  templateUrl: './create-app.component.html',
  styleUrl: './create-app.component.scss',
})
export class CreateAppComponent {
  ref = inject(DynamicDialogRef);

  appForm = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
    repository: new FormControl<string | null>(null, [
      Validators.required,
      urlValidator,
    ]),
    branch: new FormControl<string | null>(null, [Validators.required]),
    tokenId: new FormControl<string | null>(null),
  });
}
