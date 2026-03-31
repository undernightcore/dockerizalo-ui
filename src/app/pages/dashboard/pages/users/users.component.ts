import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { filter, startWith, Subject, switchMap, tap } from 'rxjs';
import {
  RegisterRequestInterface,
  UserInterface,
} from '../../../../interfaces/auth.interface';
import { AuthService } from '../../../../services/auth/auth.service';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';
import { EditPasswordComponent } from './components/edit-password/edit-password.component';

@Component({
  selector: 'app-users',
  imports: [ButtonModule, TableModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  #authService = inject(AuthService);
  #dialogService = inject(DialogService);
  #toastService = inject(MessageService);

  #reload = new Subject<void>();
  users = toSignal(
    this.#reload.pipe(
      startWith(true),
      switchMap(() => this.#authService.getUsers())
    )
  );

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
