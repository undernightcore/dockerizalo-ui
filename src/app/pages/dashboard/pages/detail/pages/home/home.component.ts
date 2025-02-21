import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AppManagerService } from '../../services/app/app.manager';
import { combineLatest, filter, map, startWith, switchMap, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { elementReady } from '../../../../../../utils/dom.utils';
import { SelectModule } from 'primeng/select';
import { TokensService } from '../../../../../../services/tokens/tokens.service';
import { urlValidator } from '../../../../validators/url.validator';
import { TooltipModule } from 'primeng/tooltip';
import { removeTerminalCodes } from '../../../../../../utils/terminal.utils';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-home',
  imports: [
    PanelModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ButtonModule,
    SkeletonModule,
    CheckboxModule,
    SelectModule,
    TooltipModule,
    FloatLabelModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('logElement') private logElement?: ElementRef<HTMLDivElement>;

  #appManager = inject(AppManagerService);
  #tokenService = inject(TokensService);
  #toastService = inject(MessageService);

  appForm = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null),
    repository: new FormControl<string | null>(null, [
      Validators.required,
      urlValidator,
    ]),
    contextPath: new FormControl<string | null>(
      null,
      Validators.pattern(/^(?!$)(\/(?!\.{1,2}(?:\/|$))[^\s\/]+)*\/?$/)
    ),
    filePath: new FormControl<string | null>(
      null,
      Validators.pattern(/^(?!$)(\/(?!\.{1,2}(?:\/|$))[^\s\/]+)*\/?$/)
    ),
    branch: new FormControl<string | null>(null, [Validators.required]),
    tokenId: new FormControl<string | null>(null),
  });

  followForm = new FormControl(true);

  app = toSignal(
    this.#appManager.app$.pipe(tap((app) => this.appForm.patchValue(app)))
  );

  tokens = toSignal(this.#tokenService.getTokens());

  logs = toSignal(
    this.#appManager.logs$.pipe(
      map(removeTerminalCodes),
      tap(
        () =>
          this.followForm.value &&
          setTimeout(
            () =>
              this.logElement?.nativeElement.scroll({
                top: this.logElement.nativeElement.scrollHeight,
              }),
            100
          )
      )
    )
  );

  saving = signal(false);
  unsaved = toSignal(
    combineLatest([
      this.appForm.valueChanges.pipe(startWith(this.appForm.value)),
      this.#appManager.app$,
    ]).pipe(
      map(
        ([form, app]) =>
          form.name !== app.name ||
          (form.description || null) !== (app.description || null) ||
          form.branch !== app.branch ||
          form.repository !== app.repository ||
          (form.contextPath || null) !== (app.contextPath || null) ||
          (form.filePath || null) !== (app.filePath || null) ||
          (form.tokenId || null) !== (app.tokenId || null)
      )
    )
  );

  _scrollToBottomIfFollowEnabledEffect = toSignal(
    elementReady('.home__content__logs').pipe(
      switchMap(() =>
        this.followForm.valueChanges.pipe(
          startWith(this.followForm.value),
          filter((checked) => Boolean(checked)),
          tap(() =>
            this.logElement?.nativeElement.scroll({
              top: this.logElement.nativeElement.scrollHeight,
            })
          )
        )
      )
    )
  );

  saveApp() {
    if (!this.appForm.valid) return;

    this.#appManager
      .updateApp({
        name: String(this.appForm.value.name),
        description: this.appForm.value.description || null,
        branch: String(this.appForm.value.branch),
        repository: String(this.appForm.value.repository),
        contextPath: this.appForm.value.contextPath || undefined,
        filePath: this.appForm.value.filePath || undefined,
        tokenId: this.appForm.value.tokenId || null,
      })
      .pipe(
        tap({
          subscribe: () => this.saving.set(true),
          finalize: () => this.saving.set(false),
          next: () =>
            this.#toastService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'The app has been saved',
            }),
        })
      )
      .subscribe();
  }
}
