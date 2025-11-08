import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { BinancePriceService } from '../../../../../../../core/services/binance-price.service';
import { UtilsService } from '../../../../../../../core/services/utils.service';
import { MarketsService } from '../../../../../../client/landing/pages/markets/services/market.service';
import { TradingApiService } from '../../../../../../client/profile/pages/trading-terminal/services/trading-api.service';
import { ClientsService } from '../../../admin-clients/services/clients.service';

export interface OpenOrder {
  _id?: string;
  clientId: any;
  clientName: string;
  pair: string;
  orderType: 'buy' | 'sell';
  balance: number;
  volume: number;
  pledge: number;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  profit: number;
  dateCreated: Date;
  dateClosed: Date | null;
}

@Component({
  selector: 'app-admin-open-orders',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './admin-open-orders.html',
  styleUrls: ['../../admin-orders.component.scss'],
})
export class AdminOpenOrdersComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  clientsList: any = [];
  orderLIst: any = [];
  activeUser: any;
  cryptoPairs: any = [];

  openDropdownId: string | null = null;
  destroy$ = new Subject<void>();
  private dialog = inject(MatDialog);
  private priceMap = new Map<string, number>();

  constructor(
    private _clients: ClientsService,
    private _utile: UtilsService,
    private _market: MarketsService,
    private _trading: TradingApiService,
    private binancePriceService: BinancePriceService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }
  ngOnInit() {
    this.activeUser = this._utile.getActiveUser();

    if (this.activeUser.role === 'admin') {
      this.groupSubForAdmin();
    } else {
      this.groupSubForWorker();
    }
  }

  groupSubForAdmin() {
    let workeId = null;
    if (this.activeUser.role !== 'admin') {
      workeId = this.activeUser.id;
    }
    forkJoin<[any, any, any]>([
      this._clients.getAllClients(),
      this._market.getCryptoPairs(),
      this._trading.loadOpenOrders(null, workeId),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([clients, cryptoPairs, orderLIst]) => {
          this.clientsList = clients;
          this.cryptoPairs = cryptoPairs;
          this.orderLIst = orderLIst.data;
          this.subscribeToOrderPrices();
        },
        error: (err) => console.error('Error fetching data', err),
      });
  }

  groupSubForWorker() {
    forkJoin<[any, any, any]>([
      this._clients.getClientsForWorker(this.activeUser.id),
      this._market.getCryptoPairs(),
      this._trading.loadOpenOrders(null, this._utile.getActiveUser().id),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([clients, cryptoPairs, orderLIst]) => {
          this.clientsList = clients.data;
          this.cryptoPairs = cryptoPairs;
          this.orderLIst = orderLIst.data;
          this.subscribeToOrderPrices();
        },
        error: (err) => console.error('Error fetching data', err),
      });
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

  openEditDialog(order?: any) {
    console.log('clientsList:', this.clientsList);
    console.log('cryptoPairs:', this.cryptoPairs);

    // Ensure data is loaded before opening dialog
    if (!this.clientsList || this.clientsList.length === 0) {
      console.error('Clients list is not loaded yet');
      return;
    }

    if (!this.cryptoPairs || this.cryptoPairs.length === 0) {
      console.error('Crypto pairs are not loaded yet');
      return;
    }

    // We'll import the AddEditOrderDialog component dynamically
    import('../../../admin-paymnets/edit-order-dialog/add-edit-order-dialog').then((m) => {
      const dialogRef = this.dialog.open(m.AddEditOrderDialog, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: {
          order,
          clients: this.clientsList,
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
  deleteOrder(order: OpenOrder) {
    this.orderLIst = this.orderLIst.filter((o: any) => o.id !== order._id);
  }

  openDeleteDialog(order?: any) {
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
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log(result);
        if (result === true) {
          this.deleteOrder(order);
          this._trading.deleteOrder(order._id).subscribe(
            (data) => {
              console.log('Order deleted successfully:', data);
            },
            (err) => {
              console.error('Error deleting order:', err);
            }
          );
        }
      });
    });
  }

  closeOrder(order: OpenOrder) {
    console.log('Closing order:', order);
    // Here you would call your API to close the order
    order.dateClosed = new Date();
  }

  cancelAll() {
    console.log('Canceling all orders');
    // Here you would call your API to cancel all orders
  }

  private subscribeToOrderPrices() {
    if (!this.orderLIst || this.orderLIst.length === 0) return;

    // Get all unique pairs from open orders
    const uniquePairs = [...new Set(this.orderLIst.map((order: any) => order.pair))].filter(
      (pair) => pair
    );

    // Unsubscribe from all previous subscriptions
    this.binancePriceService.unsubscribeAll();

    // Subscribe to each unique pair
    uniquePairs.forEach((pair: any) => {
      this.binancePriceService.subscribeToPrice(pair, (price: number) => {
        // Update price map
        this.priceMap.set(pair, price);

        // Update all orders with this pair
        this.updateOrdersWithNewPrices(pair, price);
      });
    });
  }

  /**
   * Update all orders when a new price is received for a pair
   */
  private updateOrdersWithNewPrices(pair: string, currentPrice: number) {
    this.orderLIst.forEach((order: any) => {
      if (order.pair === pair) {
        // Update current price
        order.currentPrice = currentPrice;

        // Calculate profit using the same formula as add-edit-order-dialog
        order.profit = this.calculateProfit(
          order.orderType,
          order.entryPrice,
          currentPrice,
          order.volume
        );
      }
    });
  }

  /**
   * Calculate profit based on the formula from add-edit-order-dialog:
   * BUY/LONG: Profit = (Current Price - Entry Price) × Volume
   * SELL/SHORT: Profit = (Entry Price - Current Price) × Volume
   */
  private calculateProfit(
    orderType: string,
    entryPrice: number,
    currentPrice: number,
    volume: number
  ): number {
    if (!volume || !entryPrice || !currentPrice) return 0;

    let priceDifference: number;

    if (orderType === 'buy') {
      // Long position: profit when price goes UP
      priceDifference = currentPrice - entryPrice;
    } else {
      // Short position: profit when price goes DOWN
      priceDifference = entryPrice - currentPrice;
    }

    return priceDifference * volume;
  }

  getBaseCurrency(pair: string): string {
    if (!pair) return '';
    const match = pair.match(
      /^([A-Z]+?)(USDT|FDUSD|BUSD|USDC|DAI|BTC|ETH|EUR|USD|TRY|TUSD|BNB|XRP|SOL)?$/i
    );
    return match ? match[1] : pair;
  }
}
