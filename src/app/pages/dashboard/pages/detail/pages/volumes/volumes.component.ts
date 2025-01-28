import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppManagerService } from '../../services/app/app.manager';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-volumes',
  imports: [ButtonModule],
  templateUrl: './volumes.component.html',
  styleUrl: './volumes.component.scss',
})
export class VolumesComponent {
  #appManager = inject(AppManagerService);

  volumesForm = new FormArray<
    FormGroup<{
      internal: FormControl<string | null>;
      host: FormControl<string | null>;
    }>
  >([]);

  volumes = toSignal(
    this.#appManager.volumes$.pipe(
      tap((volumes) =>
        this.volumesForm.reset(
          volumes.map(({ internal, host }) => ({ internal, host }))
        )
      )
    )
  );

  isSaved = toSignal(
    combineLatest([
      this.volumesForm.valueChanges.pipe(startWith(this.volumesForm.value)),
      this.#appManager.volumes$,
    ]).pipe(
      map(
        ([form, saved]) =>
          form.length === saved.length &&
          form.every((control) => control.internal)
      )
    )
  );

  addVolume() {
    this.volumesForm.push(
      new FormGroup({
        internal: new FormControl('', Validators.required),
        host: new FormControl('', Validators.required),
      })
    );
  }
}
