import {Component, input} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  dialogTitle = input.required<string>();
  message = input.required<string>();
  isWarn = input<boolean>(false);

  constructor(protected dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    dialogRef.disableClose = true;
  }
}
