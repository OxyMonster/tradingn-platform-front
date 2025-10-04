// recent-trades.component.ts
import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TradingService } from '../../../../../../core/services/trading.service';

interface Trade {
  id: number;
  price: number;
  quantity: number;
  time: Date;
  isBuy: boolean;
}

@Component({
  selector: 'app-recent-trades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recent-trades">
      <div class="trades-header">
        <h3>Recent Trades</h3>
      </div>

      <div class="trades-labels">
        <span>Price (USDT)</span>
        <span>Amount</span>
        <span>Time</span>
      </div>

      <div class="trades-list">
        <div
          *ngFor="let trade of trades()"
          class="trade-row"
          [class.buy]="trade.isBuy"
          [class.sell]="!trade.isBuy"
        >
          <span class="price">{{ trade.price | number : '1.2-2' }}</span>
          <span class="amount">{{ trade.quantity | number : '1.4-4' }}</span>
          <span class="time">{{ trade.time | date : 'HH:mm:ss' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .recent-trades {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #1a1a1a;
        color: #fff;
        font-size: 13px;
      }

      .trades-header {
        padding: 16px;
        border-bottom: 1px solid #3d3d3d;

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }
      }

      .trades-labels {
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

      .trades-list {
        flex: 1;
        overflow-y: auto;
      }

      .trade-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 4px 16px;
        transition: background 0.2s;

        span {
          text-align: right;

          &.price {
            text-align: left;
            font-weight: 600;
          }

          &.time {
            font-size: 11px;
            color: #999;
          }
        }

        &:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        &.buy .price {
          color: #26a69a;
        }

        &.sell .price {
          color: #ef5350;
        }
      }

      /* Custom scrollbar */
      .trades-list::-webkit-scrollbar {
        width: 6px;
      }

      .trades-list::-webkit-scrollbar-track {
        background: #1a1a1a;
      }

      .trades-list::-webkit-scrollbar-thumb {
        background: #3d3d3d;
        border-radius: 3px;
      }

      .trades-list::-webkit-scrollbar-thumb:hover {
        background: #555;
      }
    `,
  ],
})
export class RecentTradesComponent implements OnInit, OnDestroy {
  @Input() symbol: string = 'BTCUSDT';
  @Input() currentPrice: number = 0;

  private destroy$ = new Subject<void>();

  trades = signal<Trade[]>([]);

  constructor(private tradingService: TradingService) {}

  ngOnInit(): void {
    this.generateMockTrades();

    // Update trades every 2 seconds
    interval(2000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.addNewMockTrade();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private generateMockTrades(): void {
    const mockTrades: Trade[] = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const isBuy = Math.random() > 0.5;
      const priceVariation = (Math.random() - 0.5) * 100;
      const price = this.currentPrice + priceVariation;

      mockTrades.push({
        id: Date.now() + i,
        price: price,
        quantity: Math.random() * 0.5,
        time: new Date(now.getTime() - i * 3000),
        isBuy: isBuy,
      });
    }

    this.trades.set(mockTrades);
  }

  private addNewMockTrade(): void {
    const currentTrades = this.trades();
    const isBuy = Math.random() > 0.5;
    const priceVariation = (Math.random() - 0.5) * 50;
    const price = this.currentPrice + priceVariation;

    const newTrade: Trade = {
      id: Date.now(),
      price: price,
      quantity: Math.random() * 0.5,
      time: new Date(),
      isBuy: isBuy,
    };

    // Add new trade at the beginning and keep only last 50
    this.trades.set([newTrade, ...currentTrades].slice(0, 50));
  }
}
