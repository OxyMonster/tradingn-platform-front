import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgIf, NgFor, NgStyle, CommonModule } from '@angular/common';

import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DepositDialog as DepositDialogComponent } from '../../../../../shared/components/deposit-dialog/deposit-dialog';
import { MarketsService } from '../../../landing/pages/markets/services/market.service';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { LoadingComponent } from '../../../../../shared/components/loading/loading/loading';
import { SwapCryptoDialog } from '../../../../../shared/components/swap-crypto-dialog/swap-crypto-dialog';
import { ClientTransferCryptoDialog } from '../../../../../shared/components/client-transfer-crypto-dialog/client-transfer-crypto-dialog';
import { UtilsService } from '../../../../../core/services/utils.service';
import { ClientsService } from '../../../../admin/admin/components/admin-clients/services/clients.service';

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
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './wallet-component.html',
  styleUrl: './wallet-component.scss',
})
export class WalletComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  $destroy = new Subject<void>();
  client: any[] = [];
  coins: any[] = [];
  isLoading!: boolean;

  constructor(
    private _marketService: MarketsService,
    private _utile: UtilsService,
    private _client: ClientsService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.groupSubscription();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

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

    if (type === 'transfer') {
      this.dialog.open(ClientTransferCryptoDialog, {
        width: 'auto',
        height: 'auto',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
      });
    }
  }

  groupSubscription() {
    this.isLoading = true;
    this._cdr.markForCheck();
    forkJoin<[any, any, any]>([this.getClient(), this.getBalances(), this.getCoins()])
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: ([client, balances, coins]) => {
          this.client = client.data;

          // Merge balances into coins array
          this.coins = coins
            .map((coin: any) => {
              const matchingBalance = balances.data.find(
                (balance: any) => balance.asset === coin.base_asset
              );
              return {
                ...coin,
                balance: matchingBalance ? matchingBalance.amount : 0,
                collateral: matchingBalance ? matchingBalance.pledge : 0,
                trade: matchingBalance ? matchingBalance.pledge : 0,
              };
            })
            .sort((a: any, b: any) => b.balance - a.balance);

          this.isLoading = false;
          console.log(this.coins.length, this.isLoading);
          console.log(this.coins);

          this._cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this._cdr.markForCheck();
        },
      });
  }

  getClient() {
    return this._client.getClient(this._utile.getActiveUser().id);
  }

  getBalances() {
    return this._client.getClientBalance(null, this._utile.getActiveUser().id, null);
  }

  getCoins() {
    return this._marketService.getCryptoPairs();
  }
}
