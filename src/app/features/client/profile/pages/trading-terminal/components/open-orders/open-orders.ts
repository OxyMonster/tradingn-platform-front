// open-orders.component.ts
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { DemoTradingService, DemoOrder } from '../../services/demo-trading.service';

@Component({
  selector: 'app-open-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './open-orders.html',
  styleUrl: './open-orders.scss',
})
export class OpenOrdersComponent implements OnInit, OnDestroy {
  private demoTradingService = inject(DemoTradingService);
  private destroy$ = new Subject<void>();

  activeTab: 'open' | 'history' = 'open';
  openOrders: DemoOrder[] = [];
  orderHistory: DemoOrder[] = [];

  ngOnInit() {
    // Subscribe to open orders
    this.demoTradingService.orders$.pipe(takeUntil(this.destroy$)).subscribe((orders) => {
      this.openOrders = orders;
    });

    // Subscribe to order history
    this.demoTradingService.orderHistory$.pipe(takeUntil(this.destroy$)).subscribe((history) => {
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

  cancelOrder(orderId: string) {
    const result = this.demoTradingService.cancelOrder(orderId);
    if (!result.success) {
      alert(result.message);
    }
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
