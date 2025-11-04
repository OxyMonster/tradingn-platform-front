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
