import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf, NgFor, NgStyle } from '@angular/common';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DepositDialog as DepositDialogComponent } from '../../../../../shared/components/deposit-dialog/deposit-dialog';
import { MarketsService } from '../../../landing/pages/markets/services/market.service';
import { Observable } from 'rxjs';
import { LoadingComponent } from '../../../../../shared/components/loading/loading/loading';
import { SwapCryptoDialog } from '../../../../../shared/components/swap-crypto-dialog/swap-crypto-dialog';

@Component({
  selector: 'app-wallet-component',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    AsyncPipe,
    NgIf,
    NgFor,
    NgStyle,
    LoadingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wallet-component.html',
  styleUrl: './wallet-component.scss',
})
export class WalletComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  $allCoinsList: Observable<any | null>;

  constructor(private _marketService: MarketsService) {
    this.$allCoinsList = this._marketService.getCryptoPairs();
  }

  ngOnInit(): void {}

  openDialog(type: string) {
    if (type === 'deposit') {
      this.dialog.open(DepositDialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
      });
    }

    if (type === 'swap') {
      this.dialog.open(SwapCryptoDialog, {
        width: 'auto',
        height: 'auto',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
      });
    }
  }
}
