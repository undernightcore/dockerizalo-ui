import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import {
  catchError,
  EMPTY,
  filter,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  RegisterRequestInterface,
  UserInterface,
  UserRole,
} from '../../../../interfaces/auth.interface';
import { AuthService } from '../../../../services/auth/auth.service';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';

@Component({
  selector: 'app-users',
  imports: [ButtonModule, TableModule, SelectModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  #authService = inject(AuthService);
  #dialogService = inject(DialogService);
  #toastService = inject(MessageService);

  roles: { label: string; value: UserRole }[] = [
    { label: 'User', value: 'USER' },
    { label: 'Admin', value: 'ADMIN' },
  ];

  #reload = new Subject<void>();
  users = toSignal(
    this.#reload.pipe(
      startWith(true),
      switchMap(() => this.#authService.getUsers())
    )
  );

  currentUser = toSignal(this.#authService.user$);

  createUser() {
    this.#dialogService
      .open(CreateUserComponent, { header: 'Create user' })
      .onClose.pipe(
        filter((user): user is RegisterRequestInterface => Boolean(user)),
        switchMap((token) => this.#authService.createUser(token)),
        tap(() => {
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The user has been created',
          });
          this.#reload.next();
        })
      )
      .subscribe();
  }

  editUser(user: UserInterface) {
    this.#dialogService
      .open(CreateUserComponent, { header: 'Edit user', data: user })
      .onClose.pipe(
        filter(
          (updated): updated is Omit<RegisterRequestInterface, 'password'> =>
            Boolean(updated)
        ),
        switchMap((updated) => this.#authService.editUser(user.id, updated)),
        tap(() => {
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The user has been updated',
          });
          this.#reload.next();
        })
      )
      .subscribe();
  }

  editRole(user: UserInterface, role: UserRole) {
    if (role === user.role) return;

    this.#authService
      .editUser(user.id, { role })
      .pipe(
        tap(() => {
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The role has been updated',
          });
          this.#reload.next();
        }),
        catchError(() => {
          this.#reload.next();
          return EMPTY;
        })
      )
      .subscribe();
  }

  editPassword(user: UserInterface) {
    this.#dialogService
      .open(EditPasswordComponent, { header: 'Change password' })
      .onClose.pipe(
        filter((password): password is string => Boolean(password)),
        switchMap((password) =>
          this.#authService.editUser(user.id, { password })
        ),
        tap(() => {
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The password has been changed',
          });
        })
      )
      .subscribe();
  }

  deleteUser(user: UserInterface) {
    this.#dialogService
      .open(DeleteUserComponent, { header: 'Delete user', data: user })
      .onClose.pipe(
        filter((remove): remove is true => Boolean(remove)),
        switchMap(() => this.#authService.deleteUser(user.id)),
        tap(() => {
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The user has been deleted',
          });
          this.#reload.next();
        })
      )
      .subscribe();
  }
}
