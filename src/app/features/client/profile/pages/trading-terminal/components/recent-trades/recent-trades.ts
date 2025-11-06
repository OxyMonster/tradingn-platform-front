// recent-trades.component.ts
import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebSocketService, TradeData } from '../../services/websocket.service';

interface Trade {
  id: string;
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
        <div class="status-indicator" [class.connected]="isConnected">
          <span class="dot"></span>
          Live
        </div>
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
          [class.buy]="!trade.isBuy"
          [class.sell]="trade.isBuy"
        >
          <span class="price">{{ trade.price | number : '1.2-8' }}</span>
          <span class="amount">{{ trade.quantity | number : '1.4-8' }}</span>
          <span class="time">{{ trade.time | date : 'HH:mm:ss' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .recent-trades {
        height: 100%;
        min-height: 300px;
        display: flex;
        flex-direction: column;
        background-color: #0b0e11;
        border: 1px solid #2b3139;
        border-radius: 4px;
        color: #eaecef;
        font-size: 12px;
        overflow: hidden;
      }

      .trades-header {
        padding: 12px 16px;
        border-bottom: 1px solid #2b3139;
        background-color: #1e2329;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: #eaecef;
        }
      }

      .status-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        color: #848e9c;

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #848e9c;
        }

        &.connected .dot {
          background: #0ecb81;
          animation: pulse 2s ease-in-out infinite;
        }
      }

      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .trades-labels {
        display: grid;
        grid-template-columns: 1fr 1fr 70px;
        padding: 8px 16px;
        font-size: 10px;
        color: #848e9c;
        border-bottom: 1px solid #2b3139;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        background-color: #1e2329;

        span {
          text-align: right;

          &:first-child {
            text-align: left;
          }
        }

        @media (max-width: 768px) {
          grid-template-columns: 1fr 1fr 60px;
          padding: 6px 12px;
          font-size: 9px;
        }
      }

      .trades-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }

      .trade-row {
        display: grid;
        grid-template-columns: 1fr 1fr 70px;
        padding: 3px 16px;
        transition: background 0.15s;
        font-family: 'Courier New', monospace;
        font-size: 11px;

        span {
          text-align: right;
          padding: 2px 0;

          &.price {
            text-align: left;
            font-weight: 600;
          }

          &.amount {
            color: #eaecef;
          }

          &.time {
            font-size: 10px;
            color: #848e9c;
          }
        }

        &:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        &.buy .price {
          color: #0ecb81;
        }

        &.sell .price {
          color: #f6465d;
        }

        @media (max-width: 768px) {
          grid-template-columns: 1fr 1fr 60px;
          padding: 3px 12px;
          font-size: 10px;
        }
      }

      /* Custom scrollbar */
      .trades-list::-webkit-scrollbar {
        width: 4px;
      }

      .trades-list::-webkit-scrollbar-track {
        background: #0b0e11;
      }

      .trades-list::-webkit-scrollbar-thumb {
        background: #2b3139;
        border-radius: 2px;
      }

      .trades-list::-webkit-scrollbar-thumb:hover {
        background: #474d57;
      }

      @media (max-width: 1024px) {
        .recent-trades {
          min-height: 250px;
        }
      }

      @media (max-width: 768px) {
        .recent-trades {
          min-height: 200px;
        }

        .trades-header {
          padding: 10px 12px;

          h3 {
            font-size: 13px;
          }
        }
      }
    `,
  ],
})
export class RecentTradesComponent implements OnInit, OnDestroy {
  private wsService = inject(WebSocketService);
  private destroy$ = new Subject<void>();

  trades = signal<Trade[]>([]);
  isConnected = false;

  ngOnInit(): void {
    // Subscribe to real-time trades from WebSocket
    this.wsService.trades$.pipe(takeUntil(this.destroy$)).subscribe((tradeData: TradeData) => {
      const currentTrades = this.trades();

      const newTrade: Trade = {
        id: tradeData.id,
        price: tradeData.price,
        quantity: tradeData.quantity,
        time: tradeData.time,
        isBuy: !tradeData.isBuyerMaker, // isBuyerMaker means sell (maker is selling)
      };

      // Add new trade at the beginning and keep only last 50
      this.trades.set([newTrade, ...currentTrades].slice(0, 50));
    });

    // Subscribe to connection status
    this.wsService.connectionStatus$.pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.isConnected = status;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
