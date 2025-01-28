import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-confirm-discard',
  imports: [ButtonModule],
  templateUrl: './confirm-discard.component.html',
  styleUrl: './confirm-discard.component.scss',
})
export class ConfirmDiscardComponent {
  ref = inject(DynamicDialogRef);
}
