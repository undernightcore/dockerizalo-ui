import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { distinctUntilChanged, filter, map, startWith, tap } from 'rxjs';
import { AppManagerService } from './services/app/app.manager';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { MessageInterface } from '../../../../interfaces/message.interface';

@Component({
  selector: 'app-detail',
  imports: [
    CardModule,
    ButtonModule,
    SkeletonModule,
    BadgeModule,
    RouterOutlet,
  ],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  #router = inject(Router);
  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);

  route = toSignal(
    this.#router.events.pipe(
      startWith(true),
      map(() => this.#router.url.split('/').at(3)),
      distinctUntilChanged()
    )
  );

  app = toSignal(this.#appManager.app$);

  waiting = signal(false);

  startApp() {
    this.#toastService.add({
      summary: 'Info',
      detail: 'App is now starting...',
      severity: 'info',
    });

    this.#appManager
      .startApp()
      .pipe(
        filter(
          (response): response is MessageInterface => 'message' in response
        ),
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
}
