import { Component, inject, signal } from '@angular/core';
import { AppManagerService } from '../../services/app/app.manager';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';

@Component({
  selector: 'app-builds',
  imports: [ButtonModule, DatePipe, RouterOutlet, RouterLink, SkeletonModule],
  templateUrl: './builds.component.html',
  styleUrl: './builds.component.scss',
})
export class BuildsComponent {
  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);
  #router = inject(Router);

  app = toSignal(this.#appManager.app$);
  builds = toSignal(this.#appManager.builds$);
  selectedBuild = toSignal(this.#appManager.buildId$);

  waiting = signal(false);

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
}
