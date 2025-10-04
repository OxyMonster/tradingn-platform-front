// trade-form.component.ts
import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { TradingService } from '../../../../../../core/services/trading.service';

@Component({
  selector: 'app-trade-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSliderModule,
  ],
  template: `
    <div class="trade-form">
      <!-- Buy/Sell Tabs -->
      <div class="side-selector">
        <button class="side-btn buy" [class.active]="side() === 'buy'" (click)="selectSide('buy')">
          Buy
        </button>
        <button
          class="side-btn sell"
          [class.active]="side() === 'sell'"
          (click)="selectSide('sell')"
        >
          Sell
        </button>
      </div>

      <!-- Order Type Selection -->
      <div class="order-type-selector">
        <button
          class="type-btn"
          [class.active]="orderType() === 'market'"
          (click)="selectOrderType('market')"
        >
          Market
        </button>
        <button
          class="type-btn"
          [class.active]="orderType() === 'limit'"
          (click)="selectOrderType('limit')"
        >
          Limit
        </button>
      </div>

      <!-- Margin Mode: Leverage Slider -->
      <div class="form-group" *ngIf="mode === 'margin'">
        <label>Leverage: {{ leverage() }}x</label>
        <input
          type="range"
          min="1"
          max="125"
          [value]="leverage()"
          (input)="leverage.set(+$any($event.target).value)"
          class="leverage-slider"
        />
        <div class="leverage-info">
          <span>1x</span>
          <span>125x</span>
        </div>
      </div>

      <!-- Limit Price (only for limit orders) -->
      <div class="form-group" *ngIf="orderType() === 'limit'">
        <label>Price (USDT)</label>
        <input
          type="number"
          [value]="limitPrice()"
          (input)="limitPrice.set(+$any($event.target).value)"
          placeholder="0.00"
          step="0.01"
          class="form-input"
        />
      </div>

      <!-- Quantity -->
      <div class="form-group">
        <label>Amount ({{ symbol.replace('USDT', '') }})</label>
        <input
          type="number"
          [value]="quantity()"
          (input)="quantity.set(+$any($event.target).value)"
          placeholder="0.00"
          step="0.0001"
          class="form-input"
        />
      </div>

      <!-- Margin Mode: Stop Loss & Take Profit -->
      <div class="advanced-options" *ngIf="mode === 'margin'">
        <div class="form-group">
          <label>Stop Loss (Optional)</label>
          <input
            type="number"
            [value]="stopLoss()"
            (input)="stopLoss.set(+$any($event.target).value)"
            placeholder="0.00"
            step="0.01"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Take Profit (Optional)</label>
          <input
            type="number"
            [value]="takeProfit()"
            (input)="takeProfit.set(+$any($event.target).value)"
            placeholder="0.00"
            step="0.01"
            class="form-input"
          />
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <div class="summary-row">
          <span>Total:</span>
          <span class="value">{{ total | number : '1.2-2' }} USDT</span>
        </div>
        <div class="summary-row">
          <span>Fee (0.1%):</span>
          <span class="value">{{ estimatedFee | number : '1.2-2' }} USDT</span>
        </div>
        <div class="summary-row" *ngIf="mode === 'margin'">
          <span>Margin Required:</span>
          <span class="value">{{ marginRequired | number : '1.2-2' }} USDT</span>
        </div>
      </div>

      <!-- Place Order Button -->
      <button
        class="place-order-btn"
        [class.buy]="side() === 'buy'"
        [class.sell]="side() === 'sell'"
        [disabled]="isLoading()"
        (click)="placeOrder()"
      >
        <span *ngIf="!isLoading()">
          {{ side() === 'buy' ? 'Buy' : 'Sell' }} {{ symbol.replace('USDT', '') }}
        </span>
        <span *ngIf="isLoading()">Processing...</span>
      </button>

      <!-- Educational Warning for Margin -->
      <div class="warning-box" *ngIf="mode === 'margin' && leverage() > 10">
        <strong>⚠️ High Leverage Warning</strong>
        <p>
          Using {{ leverage() }}x leverage means you can lose your entire investment with a
          {{ (100 / leverage()).toFixed(2) }}% price movement against your position.
        </p>
      </div>
    </div>
  `,
  styleUrl: './trade-form.scss',
})
export class TradeFormComponent {
  @Input() symbol: string = 'BTCUSDT';
  @Input() currentPrice: number = 0;
  @Input() mode: 'spot' | 'margin' = 'spot';

  side = signal<'buy' | 'sell'>('buy');
  orderType = signal<'market' | 'limit'>('market');

  quantity = signal<number>(0);
  limitPrice = signal<number>(0);

  // Margin trading
  leverage = signal<number>(10);
  stopLoss = signal<number>(0);
  takeProfit = signal<number>(0);

  isLoading = signal<boolean>(false);

  constructor(private tradingService: TradingService, private snackBar: MatSnackBar) {}

  get total(): number {
    const price = this.orderType() === 'market' ? this.currentPrice : this.limitPrice();
    return this.quantity() * price;
  }

  get estimatedFee(): number {
    return this.total * 0.001;
  }

  get marginRequired(): number {
    if (this.mode === 'margin') {
      return this.total / this.leverage();
    }
    return 0;
  }

  selectSide(side: 'buy' | 'sell'): void {
    this.side.set(side);
  }

  selectOrderType(type: 'market' | 'limit'): void {
    this.orderType.set(type);
    if (type === 'limit' && this.limitPrice() === 0) {
      this.limitPrice.set(this.currentPrice);
    }
  }

  placeOrder(): void {
    if (this.quantity() <= 0) {
      this.snackBar.open('Please enter a valid quantity', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    if (this.orderType() === 'limit' && this.limitPrice() <= 0) {
      this.snackBar.open('Please enter a valid limit price', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    this.isLoading.set(true);

    if (this.mode === 'spot') {
      this.placeSpotOrder();
    } else {
      this.placeMarginOrder();
    }
  }

  private placeSpotOrder(): void {
    this.tradingService
      .placeSpotOrder({
        symbol: this.symbol,
        side: this.side(),
        order_type: this.orderType(),
        quantity: this.quantity(),
        price: this.orderType() === 'limit' ? this.limitPrice() : undefined,
      })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.snackBar.open('Order placed successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
            this.resetForm();
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.open(error.error?.error || 'Failed to place order', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  private placeMarginOrder(): void {
    this.tradingService
      .openPosition({
        symbol: this.symbol,
        side: this.side(),
        quantity: this.quantity(),
        leverage: this.leverage(),
        stop_loss: this.stopLoss() > 0 ? this.stopLoss() : undefined,
        take_profit: this.takeProfit() > 0 ? this.takeProfit() : undefined,
      })
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);
          if (response.success) {
            this.snackBar.open(response.warning || 'Position opened successfully!', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar'],
            });
            this.resetForm();
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.open(error.error?.error || 'Failed to open position', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  private resetForm(): void {
    this.quantity.set(0);
    this.limitPrice.set(0);
    this.stopLoss.set(0);
    this.takeProfit.set(0);
  }

  formatLabel(value: number): string {
    return `${value}x`;
  }
}
