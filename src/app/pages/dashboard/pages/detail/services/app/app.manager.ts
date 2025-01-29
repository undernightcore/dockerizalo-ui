import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppsService } from '../../../../../../services/apps/apps.service';
import {
  Subject,
  distinctUntilChanged,
  filter,
  map,
  of,
  scan,
  shareReplay,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { AppInterface } from '../../../../../../interfaces/app.interface';
import { BuildsService } from '../../../../../../services/builds/builds.service';
import { BuildInterface } from '../../../../../../interfaces/build.interface';
import { VolumesService } from '../../../../../../services/volumes/volumes.service';
import { VolumeInterface } from '../../../../../../interfaces/volume.interface';
import { PortsService } from '../../../../../../services/ports/ports.service';
import { PortInterface } from '../../../../../../interfaces/ports.interface';

@Injectable({
  providedIn: 'root',
})
export class AppManagerService {
  #router = inject(Router);
  #appsService = inject(AppsService);
  #buildsService = inject(BuildsService);
  #volumesService = inject(VolumesService);
  #portsService = inject(PortsService);

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

  logs$ = this.app$.pipe(
    switchMap((app) =>
      app.status === 'running'
        ? this.#appsService
            .getAppLogs(app.id)
            .pipe(scan((acc, message) => acc + message, ''))
        : of('No logs.')
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  builds$ = this.#appId.pipe(
    switchMap((appId) => this.#buildsService.getBuilds(appId)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  isBuilding$ = this.builds$.pipe(
    map((builds) => builds.some((build) => build.status === 'BUILDING')),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  buildId$ = this.#router.events.pipe(
    startWith(true),
    map(() => this.#router.url.split('/').at(4)),
    distinctUntilChanged(),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  build$ = this.#appId.pipe(
    switchMap((appId) =>
      this.buildId$.pipe(
        switchMap((buildId) =>
          buildId
            ? this.#buildsService
                .getBuild(appId, buildId)
                .pipe(startWith(undefined))
            : of(undefined)
        )
      )
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  #resetVolumes = new Subject<void>();
  volumes$ = this.#appId.pipe(
    switchMap((appId) =>
      this.#resetVolumes.pipe(
        startWith(true),
        switchMap(() => this.#volumesService.getVolumes(appId))
      )
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  #resetPorts = new Subject<void>();
  ports$ = this.#appId.pipe(
    switchMap((appId) =>
      this.#resetPorts.pipe(
        startWith(true),
        switchMap(() => this.#portsService.getPorts(appId))
      )
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  startApp() {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#appsService.startApp(app.id))
    );
  }

  updateApp(app: Omit<AppInterface, 'id' | 'status'>) {
    return this.app$.pipe(
      take(1),
      switchMap(({ id }) => this.#appsService.updateApp(id, app))
    );
  }

  stopApp() {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#appsService.stopApp(app.id))
    );
  }

  createBuild() {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#buildsService.createBuild(app.id))
    );
  }

  cancelBuild() {
    return this.build$.pipe(
      take(1),
      filter((build): build is BuildInterface => build !== undefined),
      switchMap((build) =>
        this.#buildsService.cancelBuild(build.appId, build.id)
      )
    );
  }

  saveVolumes(volumes: Omit<VolumeInterface, 'id' | 'appId'>[]) {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#volumesService.saveVolumes(app.id, volumes)),
      tap(() => this.#resetVolumes.next())
    );
  }

  savePorts(volumes: Omit<PortInterface, 'id' | 'appId'>[]) {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#portsService.savePorts(app.id, volumes)),
      tap(() => this.#resetPorts.next())
    );
  }
}
