import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { TabsModule } from 'primeng/tabs';
import { startWith, Subject, switchMap, tap } from 'rxjs';
import { SettingsService } from '../../../../services/settings/settings.service';

@Component({
  selector: 'app-settings',
  imports: [
    TabsModule,
    PanelModule,
    InputNumberModule,
    FloatLabelModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  #settingsService = inject(SettingsService);
  #toastService = inject(MessageService);

  #reload = new Subject<void>();
  settings = toSignal(
    this.#reload.pipe(
      startWith(true),
      switchMap(() => this.#settingsService.getSettings()),
      tap((settings) =>
        this.settingsForm.patchValue(
          Object.fromEntries(
            settings.map((setting) => [setting.name, setting.value])
          )
        )
      )
    )
  );

  settingsForm = new FormGroup({
    MAX_IMAGES: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
  });

  saveSetting(name: string) {
    const setting = this.settings()?.find((setting) => setting.name === name);
    if (!setting || !this.settingsForm.valid) return;

    this.#settingsService
      .editSetting(setting.id, this.settingsForm.get(name)?.value ?? 3)
      .pipe(
        tap({
          next: () =>
            this.#toastService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Settings have been saved',
            }),
          finalize: () => this.#reload.next(),
        })
      )
      .subscribe();
  }
}
