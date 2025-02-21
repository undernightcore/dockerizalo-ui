import { Component, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { AppManagerService } from '../../services/app/app.manager';
import { MessageService } from 'primeng/api';
import { toSignal } from '@angular/core/rxjs-interop';
import { uniqueNetworksValidator } from './validators/unique-networks.validator';
import { combineLatest, map, startWith, tap } from 'rxjs';
import { toMap } from '../../../../../../utils/array.utils';
import { NetworkInterface } from '../../../../../../interfaces/network.interface';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-networks',
  imports: [
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ToggleSwitchModule,
    TooltipModule,
    FloatLabelModule,
  ],
  templateUrl: './networks.component.html',
  styleUrl: './networks.component.scss',
})
export class NetworksComponent {
  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);

  networksForm = new FormArray<
    FormGroup<{
      name: FormControl<string | null>;
      external: FormControl<boolean | null>;
    }>
  >([], [uniqueNetworksValidator]);

  app = toSignal(this.#appManager.app$);

  networks = toSignal(
    this.#appManager.networks$.pipe(
      tap((networks) => {
        this.networksForm.clear();

        networks.forEach((network) =>
          this.networksForm.push(
            new FormGroup({
              name: new FormControl<string | null>(
                network.name,
                Validators.required
              ),
              external: new FormControl<boolean | null>(
                network.external,
                Validators.required
              ),
            })
          )
        );
      })
    )
  );

  isSaved = toSignal(
    combineLatest([
      this.networksForm.valueChanges.pipe(startWith(this.networksForm.value)),
      this.#appManager.networks$,
    ]).pipe(
      map(([form, saved]) => {
        const savedMap = toMap(
          saved,
          (item) => `${item.name}-${item.external}`
        );

        return (
          form.length === saved.length &&
          form.every((control) =>
            Boolean(savedMap.get(`${control.name}-${control.external}`))
          )
        );
      })
    )
  );

  saving = signal(false);

  addNetwork() {
    this.networksForm.push(
      new FormGroup({
        name: new FormControl<string | null>(null, Validators.required),
        external: new FormControl<boolean | null>(false, Validators.required),
      })
    );
  }

  deleteNetwork(index: number) {
    this.networksForm.removeAt(index);
  }

  saveNetworks() {
    if (!this.networksForm.valid) return;

    this.#appManager
      .saveNetworks(
        this.networksForm.value
          .filter(
            (network): network is Omit<NetworkInterface, 'id' | 'appId'> =>
              Boolean(network.name) && network.external !== null
          )
          .map(({ name, external }) => ({ name, external }))
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
