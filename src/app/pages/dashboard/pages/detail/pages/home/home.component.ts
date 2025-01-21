import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AppManagerService } from '../../services/app/app.manager';
import { combineLatest, distinctUntilChanged, map, startWith, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  imports: [
    PanelModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ButtonModule,
    SkeletonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);

  appForm = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
    repository: new FormControl<string | null>(null, [Validators.required]),
    branch: new FormControl<string | null>(null, [Validators.required]),
  });

  app = toSignal(this.#appManager.app$);
  logs = toSignal(this.#appManager.logs$);

  saving = signal(false);
  unsaved = toSignal(
    combineLatest([
      this.appForm.valueChanges.pipe(startWith(this.appForm.value)),
      this.#appManager.app$,
    ]).pipe(
      map(
        ([form, app]) =>
          form.name !== app.name ||
          (form.description || null) !== (app.description || null) ||
          form.branch !== app.branch ||
          form.repository !== app.repository
      )
    )
  );

  _patchFormOnAppChangeEffect = toSignal(
    this.#appManager.app$.pipe(tap((app) => this.appForm.patchValue(app)))
  );

  _disableFormIfAppIsRunningEffect = toSignal(
    this.#appManager.app$.pipe(
      tap((app) =>
        app.status === 'running'
          ? this.appForm.disable()
          : this.appForm.enable()
      )
    )
  );

  saveApp() {
    if (!this.appForm.valid) return;

    this.#appManager
      .updateApp({
        name: String(this.appForm.value.name),
        description: this.appForm.value.description || null,
        branch: String(this.appForm.value.branch),
        repository: String(this.appForm.value.repository),
      })
      .pipe(
        tap({
          subscribe: () => this.saving.set(true),
          finalize: () => this.saving.set(false),
          next: () =>
            this.#toastService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'The app has been saved',
            }),
        })
      )
      .subscribe();
  }
}
