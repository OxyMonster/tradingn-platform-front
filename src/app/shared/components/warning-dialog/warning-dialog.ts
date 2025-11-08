import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-warning-dialog',
  imports: [],
  templateUrl: './warning-dialog.html',
  styleUrl: './warning-dialog.scss',
})
export class WarningDialog {
  title: string;
  message: string;
  warningItems: string[];
  confirmText: string;
  cancelText: string;
  confirmColor: string;
  order: any;

  constructor(
    public dialogRef: MatDialogRef<WarningDialog>,
    @Inject(MAT_DIALOG_DATA) public data: WarningDialog
  ) {
    this.title = data?.title || 'Confirm Action';
    this.message = data?.message || 'This action cannot be undone.';
    this.warningItems = data?.warningItems || [];
    this.confirmText = data?.confirmText || 'Confirm';
    this.cancelText = data?.cancelText || 'Cancel';
    this.confirmColor = data?.confirmColor || 'warn';
    this.order = data?.order || null;
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
