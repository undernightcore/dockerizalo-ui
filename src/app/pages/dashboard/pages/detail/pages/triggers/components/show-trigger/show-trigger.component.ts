import { Component, inject, isDevMode } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { interval, map, startWith, take, tap } from 'rxjs';
import { environment } from '../../../../../../../../../environments/environment';
import { TriggerInterface } from '../../../../../../../../interfaces/trigger.interface';

@Component({
  selector: 'app-show-trigger',
  imports: [InputTextModule, ButtonModule, MessageModule],
  templateUrl: './show-trigger.component.html',
  styleUrl: './show-trigger.component.scss',
})
export class ShowTriggerComponent {
  #toastService = inject(MessageService);
  ref = inject(DynamicDialogRef);

  trigger: TriggerInterface = inject(DialogService).getInstance(this.ref).data;

  endpoint = isDevMode()
    ? `${environment.apiUrl}/apps/${this.trigger.appId}/triggers/${this.trigger.id}/webhook`
    : `${new URL(location.href).origin}${environment.apiUrl}/apps/${
        this.trigger.appId
      }/triggers/${this.trigger.id}/webhook`;

  time = toSignal(
    interval(1000).pipe(
      map((_, index) => 10 - (index + 1)),
      startWith(10),
      take(11),
      tap({ complete: () => this.ref.close() })
    )
  );

  handleClipboard() {
    navigator.clipboard
      .writeText(this.endpoint)
      .then(() =>
        this.#toastService.add({
          summary: 'Success',
          detail: 'The endpoint has been copied to your clipboard',
          severity: 'success',
        })
      )
      .catch(() =>
        this.#toastService.add({
          summary: 'Error',
          detail: "Couldn't copy the endpoint to your clipboard",
          severity: 'error',
        })
      );
  }
}
