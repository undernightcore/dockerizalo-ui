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
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith, tap } from 'rxjs';

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
    mode: new FormControl<'REPOSITORY' | 'IMAGE'>('REPOSITORY'),
    description: new FormControl<string | null>(null),
    repository: new FormControl<string | null>(null, [
      Validators.required,
      urlValidator,
    ]),
    contextPath: new FormControl<string | null>(null, [
      Validators.pattern(/^(?!$)(\/(?!\.{1,2}(?:\/|$))[^\s\/]+)*\/?$/),
    ]),
    filePath: new FormControl<string | null>(null, [
      Validators.pattern(/^(?!$)(\/(?!\.{1,2}(?:\/|$))[^\s\/]+)*\/?$/),
    ]),
    image: new FormControl<string | null>({ value: null, disabled: true }, [
      Validators.required,
    ]),
    branch: new FormControl<string | null>(null, [Validators.required]),
    tokenId: new FormControl<string | null>(null),
  });

  _enableModeFieldsEffect = toSignal(
    this.appForm.controls.mode.valueChanges.pipe(
      startWith(this.appForm.controls.mode.value),
      tap((mode) => {
        if (mode === 'REPOSITORY') {
          this.appForm.controls.repository.enable();
          this.appForm.controls.branch.enable();
          this.appForm.controls.contextPath.enable();
          this.appForm.controls.filePath.enable();
          this.appForm.controls.image.disable();
        } else if (mode === 'IMAGE') {
          this.appForm.controls.image.enable();
          this.appForm.controls.repository.disable();
          this.appForm.controls.branch.disable();
          this.appForm.controls.contextPath.disable();
          this.appForm.controls.filePath.disable();
        }
      })
    )
  );
}
