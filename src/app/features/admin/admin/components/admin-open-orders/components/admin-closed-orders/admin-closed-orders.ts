import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../../../../core/services/utils.service';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { TradingApiService } from '../../../../../../client/profile/pages/trading-terminal/services/trading-api.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MarketsService } from '../../../../../../client/landing/pages/markets/services/market.service';

@Component({
  selector: 'app-admin-closed-orders',
  imports: [CommonModule, MatDialogModule],
  standalone: true,
  templateUrl: './admin-closed-orders.html',
  styleUrl: '../../admin-orders.component.scss',
})
export class AdminClosedOrders implements OnInit {
  orderLIst: any = [];
  openDropdownId: string | null = null;
  activeUser: any = {};
  destroy$ = new Subject<void>();
  cryptoPairs: any = [];
  private dialog = inject(MatDialog);

  constructor(
    private _utile: UtilsService,
    private _trading: TradingApiService,
    private _market: MarketsService
  ) {
    this.activeUser = this._utile.getActiveUser();
  }

  ngOnInit() {
    if (this.activeUser.role === 'admin') {
      this.groupSubForAdmin();
    } else {
      this.groupSubForWorker();
    }
  }

  openEditDialog(order?: any) {
    console.log(order);

    // We'll import the AddEditOrderDialog component dynamically
    import('../edit-order-dialog/add-edit-order-dialog').then((m) => {
      const dialogRef = this.dialog.open(m.AddEditOrderDialog, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: {
          order,
          clients: [order.clientId],
          cryptoPairs: this.cryptoPairs,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (this.activeUser.role === 'admin') {
          this.groupSubForAdmin();
        } else {
          this.groupSubForWorker();
        }
      });
    });
  }

  openClosedOrderDialog(order: any) {
    // We'll import the AddEditOrderDialog component dynamically
    import('../../../../../../../shared/components/warning-dialog/warning-dialog').then((m) => {
      const dialogRef = this.dialog.open(m.WarningDialog, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: {
          order,
          message: 'Are you sure you want to reopen this order?',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        if (result === true) {
          this.onOpenClosedOrder(order);
        }
      });
    });
  }

  onOpenClosedOrder(order: any) {
    return this._trading.openClosedOrder(order).subscribe(
      (res) => {
        console.log('Order opened successfully:', res);
        if (this.activeUser.role === 'admin') {
          this.groupSubForAdmin();
        } else {
          this.groupSubForWorker();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  groupSubForAdmin() {
    let workeId = null;
    if (this.activeUser.role !== 'admin') {
      workeId = this.activeUser.id;
    }
    forkJoin<[any, any]>([
      this._trading.loadOpenOrders(null, workeId),
      this._market.getCryptoPairs(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([orderList, cryptoPairs]) => {
          this.orderLIst = orderList.data.filter((order: any) => order.status === 'closed');
          this.cryptoPairs = cryptoPairs;
        },
        error: (err) => console.error('Error fetching data', err),
      });
  }

  groupSubForWorker() {
    forkJoin<[any, any]>([
      this._trading.loadOpenOrders(null, this._utile.getActiveUser().id),
      this._market.getCryptoPairs(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([orderLIst, cryptoPairs]) => {
          this.orderLIst = orderLIst.data.filter((order: any) => order.status === 'closed');
          this.cryptoPairs = cryptoPairs;
        },
        error: (err) => console.error('Error fetching data', err),
      });
  }

  getBaseCurrency(pair: string): string {
    if (!pair) return '';
    const match = pair.match(
      /^([A-Z]+?)(USDT|FDUSD|BUSD|USDC|DAI|BTC|ETH|EUR|USD|TRY|TUSD|BNB|XRP|SOL)?$/i
    );
    return match ? match[1] : pair;
  }

  toggleDropdown(orderId: string, event: Event) {
    event.stopPropagation();
    if (this.openDropdownId === orderId) {
      this.openDropdownId = null;
      document.removeEventListener('click', this.handleClickOutside.bind(this));
    } else {
      this.openDropdownId = orderId;
      setTimeout(() => {
        document.addEventListener('click', this.handleClickOutside.bind(this));
      }, 0);
    }
  }

  closeDropdown() {
    this.openDropdownId = null;
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  private handleClickOutside() {
    this.closeDropdown();
  }
}
