// open-orders.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { TradingApiService, ApiOrder } from '../../services/trading-api.service';

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

  activeTab: 'open' | 'history' = 'open';
  openOrders: ApiOrder[] = [];
  orderHistory: ApiOrder[] = [];

  ngOnInit() {
    // Subscribe to open orders
    this.tradingApiService.orders$.pipe(takeUntil(this.destroy$)).subscribe((orders) => {
      this.openOrders = orders;
    });

    // Subscribe to order history
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
}
