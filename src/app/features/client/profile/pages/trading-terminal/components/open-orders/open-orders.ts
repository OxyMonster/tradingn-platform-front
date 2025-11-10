// open-orders.component.ts
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TradingApiService, ApiOrder } from '../../services/trading-api.service';
import { UtilsService } from '../../../../../../../core/services/utils.service';
import { WebSocketService, TickerData } from '../../services/websocket.service';
import { BinancePriceService } from '../../../../../../../core/services/binance-price.service';

@Component({
  selector: 'app-open-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './open-orders.html',
  styleUrl: './open-orders.scss',
})
export class OpenOrdersComponent implements OnInit, OnDestroy {
  private tradingApiService = inject(TradingApiService);
  private destroy$ = new Subject<void>();
  private wsService = inject(WebSocketService);
  private binancePriceService = inject(BinancePriceService);
  activeTab: 'open' | 'history' = 'open';
  openOrders: any[] = [];
  orderHistory: any[] = [];
  ticker = signal<TickerData | null>(null);
  // Track current prices for each pair
  private priceMap = new Map<string, number>();

  constructor(private _utile: UtilsService) {}

  ngOnInit() {
    // Subscribe to order history
    // Subscribe to ticker data
    this.wsService.ticker$.pipe(takeUntil(this.destroy$)).subscribe((ticker) => {
      if (ticker) {
        this.ticker.set(ticker);
      }
    });
    this.getOrders();
    this.tradingApiService.orderHistory$.pipe(takeUntil(this.destroy$)).subscribe((history) => {
      this.orderHistory = history;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // Unsubscribe from all price updates
    this.binancePriceService.unsubscribeAll();
  }

  switchTab(tab: 'open' | 'history') {
    this.activeTab = tab;
    this.getOrders();
  }

  getOrders() {
    this.tradingApiService
      .loadOpenOrders(this._utile.getActiveUser().id, null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.openOrders = result.data.filter((order: any) => order.status === 'open');
          this.orderHistory = result.data.filter((order: any) => order.status === 'closed');

          if (this.activeTab === 'open') {
            // Subscribe to prices for all unique pairs
            this.subscribeToOrderPrices();
          }
        },
        error: (error) => {
          alert(error.message || 'Failed to load open orders');
        },
      });
  }

  cancelOrder(orderId: string | undefined) {
    if (!orderId) {
      alert('Invalid order ID');
      return;
    }

    this.tradingApiService
      .cancelOrder(orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (!result.success) {
            alert(result.message);
          }
        },
        error: (error) => {
          alert(error.message || 'Failed to cancel order');
        },
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'filled':
        return 'status-filled';
      case 'cancelled':
        return 'status-cancelled';
      case 'open':
        return 'status-open';
      default:
        return '';
    }
  }

  getBaseCurrency(pair: string): string {
    if (!pair) return '';
    const match = pair.match(
      /^([A-Z]+?)(USDT|FDUSD|BUSD|USDC|DAI|BTC|ETH|EUR|USD|TRY|TUSD|BNB|XRP|SOL)?$/i
    );
    return match ? match[1] : pair;
  }

  /**
   * Subscribe to real-time prices for all unique pairs in open orders
   */
  private subscribeToOrderPrices() {
    if (!this.openOrders || this.openOrders.length === 0) return;

    // Get all unique pairs from open orders
    const uniquePairs = [...new Set(this.openOrders.map((order) => order.pair))].filter(
      (pair) => pair
    ) as string[];

    // Unsubscribe from all previous subscriptions
    this.binancePriceService.unsubscribeAll();

    // Subscribe to all pairs with a single batch request
    if (uniquePairs.length > 0) {
      this.binancePriceService.subscribeToMultiplePrices(
        uniquePairs,
        (pair: string, price: number) => {
          // Update price map
          this.priceMap.set(pair, price);

          // Update all orders with this pair
          this.updateOrdersWithNewPrices(pair, price);
        }
      );
    }
  }

  /**
   * Update all orders when a new price is received for a pair
   */
  private updateOrdersWithNewPrices(pair: string, currentPrice: number) {
    this.openOrders.forEach((order) => {
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
}
