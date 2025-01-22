import { Component, inject } from '@angular/core';
import { AppManagerService } from '../../services/app/app.manager';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { BuildInterface } from '../../../../../../interfaces/build.interface';
import { tapOnce } from '../../../../../../utils/rxjs.utils';

@Component({
  selector: 'app-builds',
  imports: [ButtonModule, DatePipe, RouterOutlet, RouterLink],
  templateUrl: './builds.component.html',
  styleUrl: './builds.component.scss',
})
export class BuildsComponent {
  #appManager = inject(AppManagerService);

  app = toSignal(this.#appManager.app$);
  builds = toSignal(this.#appManager.builds$);
  selectedBuild = toSignal(this.#appManager.buildId$);
}
