import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AppManagerService } from './services/app/app.manager';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DeleteAppComponent } from './components/delete-app/delete-app.component';

@Component({
  selector: 'app-detail',
  imports: [
    CardModule,
    ButtonModule,
    SkeletonModule,
    BadgeModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  #router = inject(Router);
  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);
  #dialogService = inject(DialogService);

  route = toSignal(
    this.#router.events.pipe(
      startWith(true),
      map(() => this.#router.url.split('/').at(3)),
      distinctUntilChanged()
    )
  );

  app = toSignal(this.#appManager.app$);

  waiting = signal(false);

  building = toSignal(this.#appManager.isBuilding$);

  startApp() {
    this.#toastService.add({
      summary: 'Info',
      detail: 'App is now starting...',
      severity: 'info',
    });

    this.#appManager
      .startApp()
      .pipe(
        tap({
          next: (response) =>
            'message' in response
              ? this.#toastService.add({
                  summary: 'Success',
                  detail: response.message,
                  severity: 'success',
                })
              : 'id' in response
              ? this.#router.navigate([
                  '/apps',
                  response.appId,
                  'builds',
                  response.id,
                ])
              : undefined,
          subscribe: () => this.waiting.set(true),
          finalize: () => this.waiting.set(false),
        })
      )
      .subscribe();
  }

  stopApp() {
    this.#toastService.add({
      summary: 'Info',
      detail: 'App is now stopping...',
      severity: 'info',
    });

    this.#appManager
      .stopApp()
      .pipe(
        tap({
          subscribe: () => this.waiting.set(true),
          finalize: () => this.waiting.set(false),
          next: ({ message }) =>
            this.#toastService.add({
              summary: 'Success',
              detail: message,
              severity: 'success',
            }),
        })
      )
      .subscribe();
  }

  createBuild() {
    this.#toastService.add({
      summary: 'Info',
      detail: 'Creating new build...',
      severity: 'info',
    });

    this.#appManager
      .createBuild()
      .pipe(
        tap({
          subscribe: () => this.waiting.set(true),
          finalize: () => this.waiting.set(false),
          next: ({ id, appId }) => {
            this.#toastService.add({
              summary: 'Success',
              detail: 'Build has started',
              severity: 'success',
            });
            this.#router.navigate(['/apps', appId, 'builds', id]);
          },
        })
      )
      .subscribe();
  }

  deleteApp() {
    this.#appManager.app$
      .pipe(
        take(1),
        switchMap(
          (app) =>
            this.#dialogService.open(DeleteAppComponent, {
              header: 'Delete app',
              data: app,
            }).onClose
        ),
        filter((request): request is { force?: boolean } => Boolean(request)),
        switchMap(({ force }) => this.#appManager.deleteApp(Boolean(force))),
        tap(({ message }) => {
          this.#toastService.add({
            summary: 'Success',
            detail: message,
            severity: 'success',
          });

          this.#router.navigate(['/']);
        })
      )
      .subscribe();
  }
}
