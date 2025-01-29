import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { AppManagerService } from '../../services/app/app.manager';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { toMap } from '../../../../../../utils/array.utils';
import { PortInterface } from '../../../../../../interfaces/ports.interface';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { uniquePortsValidator } from './validators/unique-ports.validator';

@Component({
  selector: 'app-ports',
  imports: [
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    InputNumberModule,
  ],
  templateUrl: './ports.component.html',
  styleUrl: './ports.component.scss',
})
export class PortsComponent {
  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);

  portsForm = new FormArray<
    FormGroup<{
      external: FormControl<number | null>;
      internal: FormControl<number | null>;
    }>
  >([], [uniquePortsValidator]);

  app = toSignal(
    this.#appManager.app$.pipe(
      tap(({ status }) =>
        status === 'running'
          ? this.portsForm.disable()
          : this.portsForm.enable()
      )
    )
  );

  ports = toSignal(
    this.#appManager.ports$.pipe(
      tap((ports) => {
        const disabled = this.portsForm.disabled;

        this.portsForm.clear();

        ports.forEach((port) =>
          this.portsForm.push(
            new FormGroup({
              external: new FormControl(port.external, Validators.required),
              internal: new FormControl(port.internal, Validators.required),
            })
          )
        );

        this.portsForm[disabled ? 'disable' : 'enable']();
      })
    )
  );

  isSaved = toSignal(
    combineLatest([
      this.portsForm.valueChanges.pipe(startWith(this.portsForm.value)),
      this.#appManager.ports$,
    ]).pipe(
      map(([form, saved]) => {
        const savedMap = toMap(
          saved,
          (item) => `${item.external}-${item.internal}`
        );

        return (
          form.length === saved.length &&
          form.every((control) =>
            Boolean(savedMap.get(`${control.external}-${control.internal}`))
          )
        );
      })
    )
  );

  saving = signal(false);

  addPort() {
    this.portsForm.push(
      new FormGroup({
        external: new FormControl<number | null>(null, Validators.required),
        internal: new FormControl<number | null>(null, Validators.required),
      })
    );
  }

  deletePort(index: number) {
    this.portsForm.removeAt(index);
  }

  savePorts() {
    if (!this.portsForm.valid) return;

    this.#appManager
      .savePorts(
        this.portsForm.value
          .filter(
            (port): port is Omit<PortInterface, 'id' | 'appId'> =>
              Boolean(port.internal) && Boolean(port.external)
          )
          .map(({ external, internal }) => ({
            external,
            internal,
          }))
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
