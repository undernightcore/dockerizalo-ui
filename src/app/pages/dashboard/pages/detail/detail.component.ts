import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import {
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  tap,
  timer,
} from 'rxjs';
import { AppManagerService } from './services/app/app.manager';
import { SkeletonModule } from 'primeng/skeleton';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-detail',
  imports: [CardModule, ButtonModule, SkeletonModule, BadgeModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  #router = inject(Router);
  #appManager = inject(AppManagerService);

  route = toSignal(
    this.#router.events.pipe(
      startWith(true),
      map(() => this.#router.url.split('/').at(-1)),
      filter((section): section is string => Boolean(section)),
      distinctUntilChanged()
    )
  );

  app = toSignal(
    combineLatest([this.#appManager.app$, timer(500)]).pipe(map(([app]) => app))
  );
}
