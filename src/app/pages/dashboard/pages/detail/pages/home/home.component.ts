import {
  Component,
  ElementRef,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import {
  combineLatest,
  filter,
  map,
  of,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { TokensService } from '../../../../../../services/tokens/tokens.service';
import { elementReady } from '../../../../../../utils/dom.utils';
import { removeTerminalCodes } from '../../../../../../utils/terminal.utils';
import { urlValidator } from '../../../../validators/url.validator';
import { AppManagerService } from '../../services/app/app.manager';

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
    FormsModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  @ViewChild('logElement') private logElement?: ElementRef<HTMLDivElement>;

  #appManager = inject(AppManagerService);
  #authService = inject(AuthService);
  #tokenService = inject(TokensService);
  #toastService = inject(MessageService);

  appForm = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    mode: new FormControl<'REPOSITORY' | 'IMAGE'>('REPOSITORY'),
    description: new FormControl<string | null>(null),
    repository: new FormControl<string | null>(null, [
      Validators.required,
      urlValidator,
    ]),
    contextPath: new FormControl<string | null>(null, [
      Validators.pattern(/^(?!$)(\/(?!\.{1,2}(?:\/|$))[^\s\/]+)*\/?$/),
    ]),
    filePath: new FormControl<string | null>(null, [
      Validators.pattern(/^(?!$)(\/(?!\.{1,2}(?:\/|$))[^\s\/]+)*\/?$/),
    ]),
    image: new FormControl<string | null>({ value: null, disabled: true }, [
      Validators.required,
    ]),
    branch: new FormControl<string | null>(null, [Validators.required]),
    tokenId: new FormControl<string | null>(null),
  });

  followForm = new FormControl(true);
  limitOptions = [
    { label: '300', value: 300 },
    { label: '500', value: 500 },
    { label: '1000', value: 1000 },
    { label: '5000', value: 5000 },
    { label: '10000!?', value: 10000 },
  ];

  app = toSignal(
    this.#appManager.app$.pipe(tap((app) => this.appForm.patchValue(app))),
  );

  deployment = toSignal(
    this.#appManager.deployment$.pipe(
      tap(
        () =>
          this.followForm.value &&
          setTimeout(
            () =>
              this.logElement?.nativeElement.scroll({
                top: this.logElement.nativeElement.scrollHeight,
              }),
            100,
          ),
      ),
    ),
  );

  user = toSignal(this.#authService.user$);
  admin = computed(() => this.user()?.role === 'ADMIN');

  tokens = toSignal(
    toObservable(this.admin).pipe(
      switchMap((isAdmin) =>
        isAdmin ? this.#tokenService.getTokens() : of([]),
      ),
    ),
  );

  _disableTokenFieldEffect = effect(() => {
    const tokenControl = this.appForm.controls.tokenId;

    if (this.admin()) {
      tokenControl.enable({ emitEvent: false });
    } else {
      tokenControl.disable({ emitEvent: false });
    }
  });

  logsLimit = toSignal(this.#appManager.logsLimit$, { requireSync: true });

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
            100,
          ),
      ),
    ),
  );

  saving = signal(false);
  unsaved = toSignal(
    combineLatest([
      this.appForm.valueChanges.pipe(
        startWith(true),
        map(() => this.appForm.getRawValue()),
      ),
      this.#appManager.app$,
    ]).pipe(
      map(
        ([form, app]) =>
          form.name !== app.name ||
          form.mode !== app.mode ||
          (form.description || null) !== (app.description || null) ||
          (form.branch || null) !== (app.branch || null) ||
          (form.repository || null) !== (app.repository || null) ||
          (form.image || null) !== (app.image || null) ||
          (form.contextPath || null) !== (app.contextPath || null) ||
          (form.filePath || null) !== (app.filePath || null) ||
          (form.tokenId || null) !== (app.tokenId || null),
      ),
    ),
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
            }),
          ),
        ),
      ),
    ),
  );

  _enableModeFieldsEffect = toSignal(
    this.appForm.controls.mode.valueChanges.pipe(
      startWith(this.appForm.controls.mode.value),
      tap((mode) => {
        if (mode === 'REPOSITORY') {
          this.appForm.controls.image.disable();
          this.appForm.controls.repository.enable();
          this.appForm.controls.branch.enable();
          this.appForm.controls.contextPath.enable();
          this.appForm.controls.filePath.enable();
        } else if (mode === 'IMAGE') {
          this.appForm.controls.image.enable();
          this.appForm.controls.repository.disable();
          this.appForm.controls.branch.disable();
          this.appForm.controls.contextPath.disable();
          this.appForm.controls.filePath.disable();
        }
      }),
    ),
  );

  saveApp() {
    if (!this.appForm.valid) return;

    const form = this.appForm.getRawValue();

    this.#appManager
      .updateApp({
        name: String(form.name),
        mode: form.mode as 'REPOSITORY' | 'IMAGE',
        description: form.description || null,
        branch: form.branch || null,
        repository: form.repository || null,
        image: form.image || null,
        contextPath: form.contextPath || undefined,
        filePath: form.filePath || undefined,
        tokenId: form.tokenId || null,
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
        }),
      )
      .subscribe();
  }

  limitLogs(limit: number) {
    this.#appManager.limitLogs(limit);
  }
}
