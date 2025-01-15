import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '../../services/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { SlicePipe } from '@angular/common';
import { distinctUntilChanged, map, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    CardModule,
    ButtonModule,
    RouterOutlet,
    AvatarModule,
    SlicePipe,
    RouterLink,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  #authService = inject(AuthService);
  #router = inject(Router);

  user = toSignal(this.#authService.user$);
  route = toSignal(
    this.#router.events.pipe(
      map(() => this.#router.url),
      distinctUntilChanged()
    )
  );
}
