import { CanDeactivateFn } from '@angular/router';
import { HomeComponent } from '../home.component';
import { inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDiscardComponent } from '../../../../../../../components/confirm-discard/confirm-discard.component';
import { map } from 'rxjs';

export const unsavedHomeGuard: CanDeactivateFn<HomeComponent> = (component) => {
  return (
    !component.unsaved() ||
    inject(DialogService)
      .open(ConfirmDiscardComponent, {
        header: 'Are you sure?',
        focusOnShow: false,
      })
      .onClose.pipe(map((result) => Boolean(result)))
  );
};
