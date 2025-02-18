import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppManagerService } from '../../../../services/app/app.manager';
import { CheckboxModule } from 'primeng/checkbox';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { elementReady } from '../../../../../../../../utils/dom.utils';
import { filter, map, startWith, switchMap, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { BuildInterface } from '../../../../../../../../interfaces/build.interface';
import { removeTerminalCodes } from '../../../../../../../../utils/terminal.utils';

@Component({
  selector: 'app-builds-detail',
  imports: [ReactiveFormsModule, CheckboxModule, ButtonModule],
  templateUrl: './builds-detail.component.html',
  styleUrl: './builds-detail.component.scss',
})
export class BuildsDetailComponent {
  @ViewChild('logElement') private logElement?: ElementRef<HTMLDivElement>;

  #appManager = inject(AppManagerService);
  #toastService = inject(MessageService);

  followForm = new FormControl(true);

  build = toSignal(
    this.#appManager.build$.pipe(
      map((build): BuildInterface | undefined =>
        build ? { ...build, log: removeTerminalCodes(build.log) } : undefined
      ),
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

  _scrollToBottomIfFollowEnabledEffect = toSignal(
    elementReady('.detail__logs').pipe(
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

  cancelBuild() {
    this.#appManager
      .cancelBuild()
      .pipe(
        tap(({ message }) =>
          this.#toastService.add({
            severity: 'success',
            summary: 'Success',
            detail: message,
          })
        )
      )
      .subscribe();
  }
}
