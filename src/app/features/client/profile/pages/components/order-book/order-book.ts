// order-book.component.ts
import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderBookEntry } from '../../../../../../core/models/trading.model';
import { TradingService } from '../../../../../../core/services/trading.service';

@Component({
  selector: 'app-order-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-book.component.html',
  styleUrl: './order-book.component.scss',
})
export class OrderBookComponent implements OnInit, OnDestroy {
  @Input() symbol: string = 'BTCUSDT';
  @Input() currentPrice: number = 0;

  private destroy$ = new Subject<void>();

  bids = signal<OrderBookEntry[]>([]);
  asks = signal<OrderBookEntry[]>([]);

  constructor(private tradingService: TradingService) {}

  ngOnInit(): void {
    this.updateOrderBook();

    // Update every 2 seconds
    interval(2000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateOrderBook();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateOrderBook(): void {
    const orderBook = this.tradingService.generateMockOrderBook(this.currentPrice);
    this.bids.set(orderBook.bids);
    this.asks.set(orderBook.asks);
  }
}
