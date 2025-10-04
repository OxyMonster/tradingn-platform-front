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
  template: `
    <div class="order-book">
      <div class="order-book-header">
        <h3>Order Book</h3>
      </div>

      <div class="order-book-headers">
        <span>Price (USDT)</span>
        <span>Amount</span>
        <span>Total</span>
      </div>

      <!-- Asks (Sell Orders) -->
      <div class="asks-section">
        <div *ngFor="let ask of asks().slice(0, 10).reverse()" class="order-row ask">
          <span class="price">{{ ask.price | number : '1.2-2' }}</span>
          <span class="amount">{{ ask.quantity | number : '1.4-4' }}</span>
          <span class="total">{{ ask.total | number : '1.2-2' }}</span>
        </div>
      </div>

      <!-- Current Price -->
      <div class="current-price">
        <span class="price">{{ currentPrice | number : '1.2-2' }}</span>
        <span class="label">Current Price</span>
      </div>

      <!-- Bids (Buy Orders) -->
      <div class="bids-section">
        <div *ngFor="let bid of bids().slice(0, 10)" class="order-row bid">
          <span class="price">{{ bid.price | number : '1.2-2' }}</span>
          <span class="amount">{{ bid.quantity | number : '1.4-4' }}</span>
          <span class="total">{{ bid.total | number : '1.2-2' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .order-book {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #1a1a1a;
        color: #fff;
        font-size: 13px;
      }

      .order-book-header {
        padding: 16px;
        border-bottom: 1px solid #3d3d3d;

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
      }

      .order-book-headers {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 8px 16px;
        font-size: 11px;
        color: #999;
        border-bottom: 1px solid #3d3d3d;

        span {
          text-align: right;

          &:first-child {
            text-align: left;
          }
        }
      }

      .asks-section,
      .bids-section {
        flex: 1;
        overflow-y: auto;
      }

      .order-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 4px 16px;
        cursor: pointer;
        transition: background 0.2s;

        span {
          text-align: right;

          &.price {
            text-align: left;
            font-weight: 600;
          }
        }

        &:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        &.ask .price {
          color: #ef5350;
        }

        &.bid .price {
          color: #26a69a;
        }
      }

      .current-price {
        padding: 12px 16px;
        background: #2d2d2d;
        border-top: 1px solid #3d3d3d;
        border-bottom: 1px solid #3d3d3d;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price {
          font-size: 18px;
          font-weight: 700;
          color: #26a69a;
        }

        .label {
          font-size: 12px;
          color: #999;
        }
      }
    `,
  ],
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
