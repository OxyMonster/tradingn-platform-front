// trade-form.component.ts
import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TradingService } from '../../../../../../core/services/trading.service';

@Component({
  selector: 'app-trade-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade-form.component.html',
  styleUrl: './trade-form.component.scss',
})
export class TradeFormComponent {
  @Input() symbol: string = 'BTCUSDT';
  @Input() currentPrice: number = 0;
  @Input() mode: 'spot' | 'margin' = 'spot';

  side = signal<'buy' | 'sell'>('buy');
  orderType = signal<'market' | 'limit'>('market');

  // Spot trading
  quantity = signal<number>(0);
  limitPrice = signal<number>(0);

  // Margin trading
  leverage = signal<number>(10);
  stopLoss = signal<number>(0);
  takeProfit = signal<number>(0);

  isLoading = signal<boolean>(false);

  constructor(private tradingService: TradingService, private dialogService: DialogService) {}

  get total(): number {
    const price = this.orderType() === 'market' ? this.currentPrice : this.limitPrice();
    return this.quantity() * price;
  }

  get estimatedFee(): number {
    return this.total * 0.001; // 0.1% fee
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
      this.dialogService.error('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }

    if (this.orderType() === 'limit' && this.limitPrice() <= 0) {
      this.dialogService.error('Invalid Price', 'Please enter a valid limit price');
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
            this.dialogService.success('Order Placed', 'Your order has been placed successfully');
            this.resetForm();
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.dialogService.error('Order Failed', error.error?.error || 'Failed to place order');
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
            this.dialogService.success(
              'Position Opened',
              response.warning || 'Position opened successfully'
            );
            this.resetForm();
          }
        },
        error: (error) => {
          this.isLoading.set(false);
          this.dialogService.error(
            'Position Failed',
            error.error?.error || 'Failed to open position'
          );
        },
      });
  }

  private resetForm(): void {
    this.quantity.set(0);
    this.limitPrice.set(0);
    this.stopLoss.set(0);
    this.takeProfit.set(0);
  }
}
