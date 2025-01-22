import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppManagerService } from '../../../../services/app/app.manager';

@Component({
  selector: 'app-builds-detail',
  imports: [],
  templateUrl: './builds-detail.component.html',
  styleUrl: './builds-detail.component.scss',
})
export class BuildsDetailComponent {
  #appManager = inject(AppManagerService);

  log = toSignal(this.#appManager.buildLogs$);
}
