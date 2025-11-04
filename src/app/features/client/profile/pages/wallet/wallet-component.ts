import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DepositDialog as DepositDialogComponent } from '../../../../../shared/components/deposit-dialog/deposit-dialog';

@Component({
  selector: 'app-wallet-component',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wallet-component.html',
  styleUrl: './wallet-component.scss',
})
export class WalletComponent {
  readonly dialog = inject(MatDialog);
  openDialog() {
    this.dialog.open(DepositDialogComponent, {
      width: 'auto', // let content decide width
      height: 'auto', // let content decide height
      maxWidth: '95vw', // prevent overflow horizontally
      maxHeight: '90vh', // prevent overflow vertically
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });
  }
}
