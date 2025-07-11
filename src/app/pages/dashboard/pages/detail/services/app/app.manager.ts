import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
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
import { BuildInterface } from '../../../../../../interfaces/build.interface';
import { LabelInterface } from '../../../../../../interfaces/label.interface';
import { NetworkInterface } from '../../../../../../interfaces/network.interface';
import { PortInterface } from '../../../../../../interfaces/ports.interface';
import { VariableInterface } from '../../../../../../interfaces/variable.interface';
import { VolumeInterface } from '../../../../../../interfaces/volume.interface';
import { AppsService } from '../../../../../../services/apps/apps.service';
import { BuildsService } from '../../../../../../services/builds/builds.service';
import { LabelsService } from '../../../../../../services/labels/labels.service';
import { NetworksService } from '../../../../../../services/networks/networks.service';
import { PortsService } from '../../../../../../services/ports/ports.service';
import { TriggersService } from '../../../../../../services/triggers/triggers.service';
import { VariablesService } from '../../../../../../services/variables/variables.service';
import { VolumesService } from '../../../../../../services/volumes/volumes.service';

@Injectable()
export class AppManagerService {
  #router = inject(Router);
  #appsService = inject(AppsService);
  #buildsService = inject(BuildsService);
  #volumesService = inject(VolumesService);
  #portsService = inject(PortsService);
  #variablesService = inject(VariablesService);
  #networksService = inject(NetworksService);
  #labelsService = inject(LabelsService);
  #triggersService = inject(TriggersService);

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

  #logsLimit = new BehaviorSubject<number>(300);
  logsLimit$ = this.#logsLimit.asObservable();
  logs$ = combineLatest([this.app$, this.#logsLimit]).pipe(
    switchMap(([app, limit]) =>
      app.status === 'running' || app.status === 'restarting'
        ? this.#appsService.getAppLogs(app.id, limit).pipe(
            scan(
              (acc, message) => [...acc, message].slice(-limit),
              [] as string[]
            ),
            map((logs) =>
              logs.join('').trim().split('\n').slice(-limit).join('\n')
            )
          )
        : of('No logs.')
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  deployment$ = this.app$.pipe(
    switchMap((app) => this.#appsService.getAppDeploymentLogs(app.id)),
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

  #resetVariables = new Subject<void>();
  variables$ = this.#appId.pipe(
    switchMap((appId) =>
      this.#resetVariables.pipe(
        startWith(true),
        switchMap(() => this.#variablesService.getVariables(appId))
      )
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  #resetNetworks = new Subject<void>();
  networks$ = this.#appId.pipe(
    switchMap((appId) =>
      this.#resetNetworks.pipe(
        startWith(true),
        switchMap(() => this.#networksService.getNetworks(appId))
      )
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  #resetLabels = new Subject<void>();
  labels$ = this.#appId.pipe(
    switchMap((appId) =>
      this.#resetLabels.pipe(
        startWith(true),
        switchMap(() => this.#labelsService.getLabels(appId))
      )
    ),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  #resetTriggers = new Subject<void>();
  triggers$ = this.#appId.pipe(
    switchMap((appId) =>
      this.#resetTriggers.pipe(
        startWith(true),
        switchMap(() => this.#triggersService.getTriggers(appId))
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

  limitLogs(limit: number) {
    this.#logsLimit.next(limit);
  }

  stopApp() {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#appsService.stopApp(app.id))
    );
  }

  deleteApp(force: boolean) {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#appsService.deleteApp(app.id, force))
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

  saveVariables(variables: Omit<VariableInterface, 'id' | 'appId'>[]) {
    return this.app$.pipe(
      take(1),
      switchMap((app) =>
        this.#variablesService.saveVariables(app.id, variables)
      ),
      tap(() => this.#resetVariables.next())
    );
  }

  saveNetworks(networks: Omit<NetworkInterface, 'id' | 'appId'>[]) {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#networksService.saveNetworks(app.id, networks)),
      tap(() => this.#resetNetworks.next())
    );
  }

  saveLabels(labels: Omit<LabelInterface, 'id' | 'appId'>[]) {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#labelsService.saveLabels(app.id, labels)),
      tap(() => this.#resetLabels.next())
    );
  }

  createTrigger(trigger: { name: string }) {
    return this.app$.pipe(
      take(1),
      switchMap((app) => this.#triggersService.createTrigger(app.id, trigger)),
      tap(() => this.#resetTriggers.next())
    );
  }

  editTrigger(triggerId: string, trigger: { name: string }) {
    return this.app$.pipe(
      take(1),
      switchMap((app) =>
        this.#triggersService.editTrigger(app.id, triggerId, trigger)
      ),
      tap(() => this.#resetTriggers.next())
    );
  }

  deleteTrigger(triggerId: string) {
    return this.app$.pipe(
      take(1),
      switchMap((app) =>
        this.#triggersService.deleteTrigger(app.id, triggerId)
      ),
      tap(() => this.#resetTriggers.next())
    );
  }
}
