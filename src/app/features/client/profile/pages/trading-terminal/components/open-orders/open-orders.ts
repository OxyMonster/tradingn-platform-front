// open-orders.component.ts
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TradingApiService, ApiOrder } from '../../services/trading-api.service';
import { UtilsService } from '../../../../../../../core/services/utils.service';
import { WebSocketService, TickerData } from '../../services/websocket.service';

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
  activeTab: 'open' | 'history' = 'open';
  openOrders: any[] = [];
  orderHistory: ApiOrder[] = [];
  ticker = signal<TickerData | null>(null);

  constructor(private _utile: UtilsService) {}

  ngOnInit() {
    // Subscribe to order history
    // Subscribe to ticker data
    this.wsService.ticker$.pipe(takeUntil(this.destroy$)).subscribe((ticker) => {
      if (ticker) {
        this.ticker.set(ticker);
      }
    });
    this.getOpenOrders();
    this.tradingApiService.orderHistory$.pipe(takeUntil(this.destroy$)).subscribe((history) => {
      this.orderHistory = history;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  switchTab(tab: 'open' | 'history') {
    this.activeTab = tab;
  }

  getOpenOrders() {
    this.tradingApiService
      .loadOpenOrders(this._utile.getActiveUser().id, null)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result: any) => {
          this.openOrders = result.data;
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
}
