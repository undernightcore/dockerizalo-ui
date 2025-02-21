import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppManagerService } from '../../services/app/app.manager';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { toMap } from '../../../../../../utils/array.utils';
import { MessageModule } from 'primeng/message';
import { VolumeInterface } from '../../../../../../interfaces/volume.interface';
import { MessageService } from 'primeng/api';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-volumes',
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    FloatLabelModule,
  ],
  templateUrl: './volumes.component.html',
  styleUrl: './volumes.component.scss',
})
export class VolumesComponent {
  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);

  volumesForm = new FormArray<
    FormGroup<{
      host: FormControl<string | null>;
      internal: FormControl<string | null>;
    }>
  >([]);

  app = toSignal(this.#appManager.app$);

  saving = signal(false);

  volumes = toSignal(
    this.#appManager.volumes$.pipe(
      tap((volumes) => {
        this.volumesForm.clear();

        volumes.forEach((volume) =>
          this.volumesForm.push(
            new FormGroup({
              host: new FormControl(volume.host, Validators.required),
              internal: new FormControl(volume.internal, Validators.required),
            })
          )
        );
      })
    )
  );

  isSaved = toSignal(
    combineLatest([
      this.volumesForm.valueChanges.pipe(startWith(this.volumesForm.value)),
      this.#appManager.volumes$,
    ]).pipe(
      map(([form, saved]) => {
        const savedMap = toMap(
          saved,
          (item) => `${item.host}-${item.internal}`
        );

        return (
          form.length === saved.length &&
          form.every((control) =>
            Boolean(savedMap.get(`${control.host}-${control.internal}`))
          )
        );
      })
    )
  );

  addVolume() {
    this.volumesForm.push(
      new FormGroup({
        host: new FormControl('', Validators.required),
        internal: new FormControl('', Validators.required),
      })
    );
  }

  deleteVolume(index: number) {
    this.volumesForm.removeAt(index);
  }

  saveVolumes() {
    if (!this.volumesForm.valid) return;

    this.#appManager
      .saveVolumes(
        this.volumesForm.value
          .filter(
            (volume): volume is Omit<VolumeInterface, 'id' | 'appId'> =>
              Boolean(volume.internal) && Boolean(volume.host)
          )
          .map(({ host, internal }) => ({
            host,
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
