import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppsService } from '../../../../../../services/apps/apps.service';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AppManagerService {
  #router = inject(Router);
  #appsService = inject(AppsService);

  #appId = this.#router.events.pipe(
    startWith(true),
    map(() => this.#router.url.split('/').at(2)),
    filter((appId): appId is string => Boolean(appId)),
    distinctUntilChanged(),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  app$ = this.#appId.pipe(
    switchMap((appId) => this.#appsService.getApp(appId)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
}
