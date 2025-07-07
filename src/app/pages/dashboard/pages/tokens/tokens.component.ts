import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, filter, startWith, switchMap, tap } from 'rxjs';
import { TokenInterface } from '../../../../interfaces/token.interface';
import { TokensService } from '../../../../services/tokens/tokens.service';
import { CreateTokenComponent } from './components/create-token/create-token.component';
import { DeleteTokenComponent } from './components/delete-token/delete-token.component';

@Component({
  selector: 'app-tokens',
  imports: [CardModule, ButtonModule],
  templateUrl: './tokens.component.html',
  styleUrl: './tokens.component.scss',
})
export class TokensComponent {
  #tokenService = inject(TokensService);
  #dialogService = inject(DialogService);
  #toastService = inject(MessageService);

  #reloadTokens = new Subject<void>();
  tokens = toSignal(
    this.#reloadTokens.pipe(
      startWith(true),
      switchMap(() => this.#tokenService.getTokens())
    )
  );

  createToken() {
    this.#dialogService
      .open(CreateTokenComponent, { header: 'Create token' })
      .onClose.pipe(
        filter((token): token is Omit<TokenInterface, 'id'> => Boolean(token)),
        switchMap((token) => this.#tokenService.createToken(token)),
        tap(() => {
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The token has been created',
          });
          this.#reloadTokens.next();
        })
      )
      .subscribe(() => {});
  }

  editToken(token: TokenInterface) {
    this.#dialogService
      .open(CreateTokenComponent, { header: 'Edit token', data: token })
      .onClose.pipe(
        filter((updated): updated is Omit<TokenInterface, 'id'> =>
          Boolean(updated)
        ),
        switchMap((updated) =>
          this.#tokenService.updateToken(token.id, updated)
        ),
        tap(() => {
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The token has been updated',
          });
          this.#reloadTokens.next();
        })
      )
      .subscribe(() => {});
  }

  deleteToken(token: TokenInterface) {
    this.#dialogService
      .open(DeleteTokenComponent, { header: 'Delete token', data: token })
      .onClose.pipe(
        filter((remove): remove is true => Boolean(remove)),
        switchMap(() => this.#tokenService.deleteToken(token.id)),
        tap(() => {
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'The token has been deleted',
          });
          this.#reloadTokens.next();
        })
      )
      .subscribe(() => {});
  }
}
