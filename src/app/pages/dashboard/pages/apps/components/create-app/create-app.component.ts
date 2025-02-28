import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { SelectModule } from 'primeng/select';
import { startWith, tap } from 'rxjs';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { urlValidator } from '../../../../validators/url.validator';

@Component({
  selector: 'app-create-app',
  imports: [
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ButtonModule,
    FloatLabelModule,
    SelectModule,
  ],
  templateUrl: './create-app.component.html',
  styleUrl: './create-app.component.scss',
})
export class CreateAppComponent {
  ref = inject(DynamicDialogRef);
  #templatesService = inject(TemplatesService);

  templates = toSignal(this.#templatesService.getTemplates());

  appForm = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    mode: new FormControl<'REPOSITORY' | 'IMAGE' | 'TEMPLATE'>('REPOSITORY'),
    description: new FormControl<string | null>(null),
    template: new FormControl<string | null>(
      { value: null, disabled: true },
      Validators.required
    ),
    repository: new FormControl<string | null>(null, [
      Validators.required,
      urlValidator,
    ]),
    image: new FormControl<string | null>({ value: null, disabled: true }, [
      Validators.required,
    ]),
    branch: new FormControl<string | null>(null, [Validators.required]),
  });

  _enableModeFieldsEffect = toSignal(
    this.appForm.controls.mode.valueChanges.pipe(
      startWith(this.appForm.controls.mode.value),
      tap((mode) => {
        if (mode === 'REPOSITORY') {
          this.appForm.controls.repository.enable();
          this.appForm.controls.branch.enable();
          this.appForm.controls.image.disable();
          this.appForm.controls.template.disable();
        } else if (mode === 'IMAGE') {
          this.appForm.controls.image.enable();
          this.appForm.controls.repository.disable();
          this.appForm.controls.branch.disable();
          this.appForm.controls.template.disable();
        } else if (mode === 'TEMPLATE') {
          this.appForm.controls.template.enable();
          this.appForm.controls.repository.disable();
          this.appForm.controls.branch.disable();
          this.appForm.controls.image.disable();
        }
      })
    )
  );
}
