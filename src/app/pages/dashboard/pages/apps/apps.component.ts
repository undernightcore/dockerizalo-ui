import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { AppsService } from '../../../../services/apps/apps.service';
import { SkeletonModule } from 'primeng/skeleton';
import { forkJoin, map, timer } from 'rxjs';

@Component({
  selector: 'app-apps',
  imports: [CardModule, SkeletonModule],
  templateUrl: './apps.component.html',
  styleUrl: './apps.component.scss',
})
export class AppsComponent {
  #appsService = inject(AppsService);

  apps = toSignal(
    forkJoin([this.#appsService.getApps(), timer(500)]).pipe(
      map(([apps]) => apps)
    )
  );
}
