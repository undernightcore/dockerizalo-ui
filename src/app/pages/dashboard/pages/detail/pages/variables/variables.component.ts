import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AppManagerService } from '../../services/app/app.manager';
import { MessageService } from 'primeng/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { toMap } from '../../../../../../utils/array.utils';
import { VariableInterface } from '../../../../../../interfaces/variable.interface';
import { uniqueVariablesValidator } from './validators/unique-variables.validator';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-variables',
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ToggleSwitchModule,
    TooltipModule,
    FloatLabelModule,
  ],
  templateUrl: './variables.component.html',
  styleUrl: './variables.component.scss',
})
export class VariablesComponent {
  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);

  variablesForm = new FormArray<
    FormGroup<{
      key: FormControl<string | null>;
      value: FormControl<string | null>;
      build: FormControl<boolean | null>;
    }>
  >([], [uniqueVariablesValidator]);

  app = toSignal(this.#appManager.app$);

  variables = toSignal(
    this.#appManager.variables$.pipe(
      tap((variables) => {
        this.variablesForm.clear();

        variables.forEach((variable) =>
          this.variablesForm.push(
            new FormGroup({
              key: new FormControl(variable.key, Validators.required),
              value: new FormControl(variable.value, Validators.required),
              build: new FormControl(variable.build, Validators.required),
            })
          )
        );
      })
    )
  );

  isSaved = toSignal(
    combineLatest([
      this.variablesForm.valueChanges.pipe(startWith(this.variablesForm.value)),
      this.#appManager.variables$,
    ]).pipe(
      map(([form, saved]) => {
        const savedMap = toMap(
          saved,
          (item) => `${item.key}-${item.value}-${item.build}`
        );

        return (
          form.length === saved.length &&
          form.every((control) =>
            Boolean(
              savedMap.get(`${control.key}-${control.value}-${control.build}`)
            )
          )
        );
      })
    )
  );

  saving = signal(false);

  addVariable() {
    this.variablesForm.push(
      new FormGroup({
        key: new FormControl<string | null>(null, Validators.required),
        value: new FormControl<string | null>(null, Validators.required),
        build: new FormControl<boolean | null>(false, Validators.required),
      })
    );
  }

  deleteVariable(index: number) {
    this.variablesForm.removeAt(index);
  }

  saveVariables() {
    if (!this.variablesForm.valid) return;

    this.#appManager
      .saveVariables(
        this.variablesForm.value
          .filter(
            (variable): variable is Omit<VariableInterface, 'id' | 'appId'> =>
              Boolean(variable.key) &&
              Boolean(variable.value) &&
              variable.build !== null
          )
          .map(({ key, value, build }) => ({ key, value, build }))
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
