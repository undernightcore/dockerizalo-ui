import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { uniqueLabelsValidator } from './validators/unique-labels.validator';
import { AppManagerService } from '../../services/app/app.manager';
import { MessageService } from 'primeng/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { toMap } from '../../../../../../utils/array.utils';
import { LabelInterface } from '../../../../../../interfaces/label.interface';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-labels',
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    FloatLabelModule,
  ],
  templateUrl: './labels.component.html',
  styleUrl: './labels.component.scss',
})
export class LabelsComponent {
  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);

  labelsForm = new FormArray<
    FormGroup<{
      key: FormControl<string | null>;
      value: FormControl<string | null>;
    }>
  >([], [uniqueLabelsValidator]);

  app = toSignal(this.#appManager.app$);

  labels = toSignal(
    this.#appManager.labels$.pipe(
      tap((labels) => {
        this.labelsForm.clear();

        labels.forEach((label) =>
          this.labelsForm.push(
            new FormGroup({
              key: new FormControl(label.key, Validators.required),
              value: new FormControl(label.value, Validators.required),
            })
          )
        );
      })
    )
  );

  isSaved = toSignal(
    combineLatest([
      this.labelsForm.valueChanges.pipe(startWith(this.labelsForm.value)),
      this.#appManager.labels$,
    ]).pipe(
      map(([form, saved]) => {
        const savedMap = toMap(saved, (item) => `${item.key}-${item.value}`);

        return (
          form.length === saved.length &&
          form.every((control) =>
            Boolean(savedMap.get(`${control.key}-${control.value}`))
          )
        );
      })
    )
  );

  saving = signal(false);

  addLabel() {
    this.labelsForm.push(
      new FormGroup({
        key: new FormControl<string | null>(null, Validators.required),
        value: new FormControl<string | null>(null, Validators.required),
      })
    );
  }

  deleteLabel(index: number) {
    this.labelsForm.removeAt(index);
  }

  saveLabels() {
    if (!this.labelsForm.valid) return;

    this.#appManager
      .saveLabels(
        this.labelsForm.value
          .filter(
            (variable): variable is Omit<LabelInterface, 'id' | 'appId'> =>
              Boolean(variable.key) && Boolean(variable.value)
          )
          .map(({ key, value }) => ({ key, value }))
      )
      .pipe(
        tap({
          subscribe: () => this.saving.set(true),
          finalize: () => this.saving.set(false),
          next: ({ message }) =>
            this.#toastService.add({
              severity: 'success',
              summary: 'Success',
              detail: message,
            }),
        })
      )
      .subscribe();
  }
}
