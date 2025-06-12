import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { filter, switchMap, tap } from 'rxjs';
import { TriggerInterface } from '../../../../../../interfaces/trigger.interface';
import { AppManagerService } from '../../services/app/app.manager';
import { CreateTriggerComponent } from './components/create-trigger/create-trigger.component';
import { DeleteTriggerComponent } from './components/delete-trigger/delete-trigger.component';
import { ShowTriggerComponent } from './components/show-trigger/show-trigger.component';

@Component({
  selector: 'app-triggers',
  imports: [ButtonModule, ProgressSpinnerModule],
  templateUrl: './triggers.component.html',
  styleUrl: './triggers.component.scss',
})
export class TriggersComponent {
  #appManager = inject(AppManagerService);
  #dialogService = inject(DialogService);

  triggers = toSignal(this.#appManager.triggers$);

  handleCreate() {
    this.#dialogService
      .open(CreateTriggerComponent, {
        header: 'Create trigger',
      })
      .onClose.pipe(
        filter(
          (trigger?: { name: string }) =>
            trigger !== undefined && trigger !== null
        ),
        switchMap((trigger) => this.#appManager.createTrigger(trigger)),
        tap((trigger) => this.handleTrigger(trigger))
      )
      .subscribe();
  }

  handleEdit(trigger: TriggerInterface) {
    this.#dialogService
      .open(CreateTriggerComponent, {
        header: 'Edit trigger',
        data: trigger,
      })
      .onClose.pipe(
        filter(
          (updated?: { name: string }) =>
            updated !== undefined && updated !== null
        ),
        switchMap((updated) =>
          this.#appManager.editTrigger(trigger.id, updated)
        )
      )
      .subscribe();
  }

  handleTrigger(trigger: TriggerInterface) {
    this.#dialogService.open(ShowTriggerComponent, {
      header: 'Trigger endpoint',
      data: trigger,
      focusOnShow: false,
      closable: true,
    });
  }

  handleDelete(trigger: TriggerInterface) {
    this.#dialogService
      .open(DeleteTriggerComponent, {
        header: 'Delete trigger',
        data: trigger,
      })
      .onClose.pipe(
        filter((deleted) => Boolean(deleted)),
        switchMap(() => this.#appManager.deleteTrigger(trigger.id))
      )
      .subscribe();
  }
}
