import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../components';


@Directive({
  selector: '[confirm]',
  standalone: true
})
export class ConfirmDirective {
  @Input() dialogTitle: string = '';
  @Input() message: string = '';
  @Input() isWarn: boolean = false;
  @Output() confirmed = new EventEmitter();

  constructor(private dialog: MatDialog) {
  }

  @HostListener('click', ['$event.target'])
  onClick(): void {
    this.openConfirmDialog();
  }

  private openConfirmDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = 500;
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      undefined,
      boolean
    >(ConfirmDialogComponent, dialogConfig);
    const instance = dialogRef.componentInstance;
    instance.dialogTitle = this.dialogTitle;
    instance.message = this.message;
    instance.isWarn = this.isWarn;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.confirmed.emit();
      }
    });
  }
}
