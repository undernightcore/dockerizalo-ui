import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { defer, map, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-auth',
  imports: [
    CardModule,
    InputTextModule,
    FloatLabelModule,
    ButtonModule,
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  #route = inject(ActivatedRoute);
  #authService = inject(AuthService);
  #router = inject(Router);

  authForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  isLogin = toSignal(
    this.#route.url.pipe(
      map((url) => url.at(-1)?.path === 'login'),
      tap(() => this.authForm.reset()),
      tap((isLogin) =>
        isLogin
          ? this.authForm.controls.name.disable()
          : this.authForm.controls.name.enable()
      )
    )
  );

  submit() {
    Object.values(this.authForm.controls).forEach((control) =>
      control.markAsDirty()
    );

    if (!this.authForm.valid) return;

    defer(() =>
      this.isLogin()
        ? this.#authService.loginUser({
            email: String(this.authForm.controls.email.value),
            password: String(this.authForm.controls.password.value),
          })
        : this.#authService.registerUser({
            name: String(this.authForm.controls.name.value),
            email: String(this.authForm.controls.email.value),
            password: String(this.authForm.controls.password.value),
          })
    )
      .pipe(switchMap(() => this.#router.navigate(['/'])))
      .subscribe();
  }
}
