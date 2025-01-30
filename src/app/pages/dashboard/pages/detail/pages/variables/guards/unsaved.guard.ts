import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDiscardComponent } from '../../../../../../../components/confirm-discard/confirm-discard.component';
import { map } from 'rxjs';
import { VariablesComponent } from '../variables.component';

export const unsavedVariablesGuard: CanDeactivateFn<VariablesComponent> = (
  component
) => {
  return (
    component.isSaved() ||
    inject(DialogService)
      .open(ConfirmDiscardComponent, {
        header: 'Are you sure?',
        focusOnShow: false,
      })
      .onClose.pipe(map((result) => Boolean(result)))
  );
};
