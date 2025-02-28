import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { filter, forkJoin, map, switchMap, take, tap, timer } from 'rxjs';
import {
  AppFromTemplateRequestInterface,
  AppInterface,
} from '../../../../interfaces/app.interface';
import { AppsService } from '../../../../services/apps/apps.service';
import { CreateAppComponent } from './components/create-app/create-app.component';

@Component({
  selector: 'app-apps',
  imports: [CardModule, SkeletonModule, BadgeModule, ButtonModule],
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss',
})
export class AppsComponent {
  #appsService = inject(AppsService);
  #dialogService = inject(DialogService);
  #toastService = inject(MessageService);
  #router = inject(Router);

  apps = toSignal(
    forkJoin([this.#appsService.getApps(), timer(500)]).pipe(
      map(([apps]) => apps)
    )
  );

  createApp() {
    this.#dialogService
      .open(CreateAppComponent, {
        header: 'Create new app',
        focusOnShow: false,
        closable: true,
      })
      .onClose.pipe(
        take(1),
        filter(
          (
            value
          ): value is
            | AppFromTemplateRequestInterface
            | Omit<AppInterface, 'id' | 'status'> => Boolean(value)
        ),
        switchMap((value) =>
          value.mode === 'TEMPLATE'
            ? this.#appsService.createAppFromTemplate(value)
            : this.#appsService.createApp(value)
        ),
        tap(() =>
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The app has been created',
          })
        ),
        switchMap((app) => this.#router.navigate(['/apps', app.id]))
      )
      .subscribe();
  }

  goToApp(appId: string) {
    this.#router.navigate(['/apps', appId]);
  }
}
