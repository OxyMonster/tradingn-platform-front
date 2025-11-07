import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  TradingApiService,
  OrderType,
  OrderSide,
  ApiBalance,
} from '../../services/trading-api.service';
import { WebSocketService, TickerData } from '../../services/websocket.service';

@Component({
  selector: 'app-buy-sell',
  templateUrl: './buy-sell.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./buy-sell.component.scss'],
})
export class BuySellComponent implements OnInit, OnDestroy {
  @Input() symbol = 'BTCUSDT';
  @Input() currentPrice = 0;

  private tradingApiService = inject(TradingApiService);
  private wsService = inject(WebSocketService);
  private destroy$ = new Subject<void>();

  activeOrderType: OrderType = 'limit';
  ticker: TickerData | null = null;

  // Balances
  baseAssetBalance: ApiBalance | null = null;
  quoteAssetBalance: ApiBalance | null = null;

  // Buy form
  buyPrice = '';
  buyAmount = '';
  buyTriggerPrice = '';
  buyTotal = 0;
  buyFee = 0;

  // Sell form
  sellPrice = '';
  sellAmount = '';
  sellTriggerPrice = '';
  sellTotal = 0;
  sellFee = 0;

  // UI state
  successMessage = '';
  errorMessage = '';
  processing = false;

  private readonly FEE_RATE = 0.001; // 0.1%

  ngOnInit() {
    // Subscribe to ticker for current price
    this.wsService.ticker$.pipe(takeUntil(this.destroy$)).subscribe((ticker) => {
      if (ticker) {
        this.ticker = ticker;
        if (this.activeOrderType === 'limit' && !this.buyPrice) {
          this.buyPrice = ticker.price.toFixed(2);
          this.sellPrice = ticker.price.toFixed(2);
        }
        this.currentPrice = ticker.price;
      }
    });

    // Subscribe to balances
    this.tradingApiService.balances$.pipe(takeUntil(this.destroy$)).subscribe((balances) => {
      const baseAsset = this.symbol.replace('USDT', '');
      this.baseAssetBalance = balances.get(baseAsset) || null;
      this.quoteAssetBalance = balances.get('USDT') || null;
    });

    // Initialize prices
    if (this.currentPrice > 0) {
      this.buyPrice = this.currentPrice.toFixed(2);
      this.sellPrice = this.currentPrice.toFixed(2);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  switchOrderType(type: OrderType) {
    this.activeOrderType = type;
    this.clearMessages();

    // Set default prices for limit orders
    if (type === 'limit' && this.currentPrice > 0) {
      this.buyPrice = this.currentPrice.toFixed(2);
      this.sellPrice = this.currentPrice.toFixed(2);
    }
  }

  // Buy calculations
  onBuyPriceChange() {
    this.calculateBuyTotal();
  }

  onBuyAmountChange() {
    this.calculateBuyTotal();
  }

  calculateBuyTotal() {
    const price =
      this.activeOrderType === 'market' ? this.currentPrice : parseFloat(this.buyPrice) || 0;
    const amount = parseFloat(this.buyAmount) || 0;

    if (price > 0 && amount > 0) {
      this.buyTotal = price * amount;
      this.buyFee = this.buyTotal * this.FEE_RATE;
    } else {
      this.buyTotal = 0;
      this.buyFee = 0;
    }
  }

  setBuyPercentage(percent: number) {
    if (!this.quoteAssetBalance) return;

    const available = this.quoteAssetBalance.free;
    const price =
      this.activeOrderType === 'market' ? this.currentPrice : parseFloat(this.buyPrice) || 0;

    if (price > 0) {
      const amountWithFee = (available * (percent / 100)) / (1 + this.FEE_RATE);
      this.buyAmount = (amountWithFee / price).toFixed(8);
      this.calculateBuyTotal();
    }
  }

  // Sell calculations
  onSellPriceChange() {
    this.calculateSellTotal();
  }

  onSellAmountChange() {
    this.calculateSellTotal();
  }

  calculateSellTotal() {
    const price =
      this.activeOrderType === 'market' ? this.currentPrice : parseFloat(this.sellPrice) || 0;
    const amount = parseFloat(this.sellAmount) || 0;

    if (price > 0 && amount > 0) {
      this.sellTotal = price * amount;
      this.sellFee = this.sellTotal * this.FEE_RATE;
    } else {
      this.sellTotal = 0;
      this.sellFee = 0;
    }
  }

  setSellPercentage(percent: number) {
    if (!this.baseAssetBalance) return;

    const available = this.baseAssetBalance.free;
    this.sellAmount = (available * (percent / 100)).toFixed(8);
    this.calculateSellTotal();
  }

  // Place orders
  // placeBuyOrder() {
  //   this.clearMessages();
  //   this.processing = true;

  //   const amount = parseFloat(this.buyAmount);
  //   const price = this.activeOrderType === 'market' ? this.currentPrice : parseFloat(this.buyPrice);
  //   const triggerPrice = this.buyTriggerPrice ? parseFloat(this.buyTriggerPrice) : undefined;

  //   if (!amount || amount <= 0) {
  //     this.errorMessage = 'Please enter a valid amount';
  //     this.processing = false;
  //     return;
  //   }

  //   if (this.activeOrderType !== 'market' && (!price || price <= 0)) {
  //     this.errorMessage = 'Please enter a valid price';
  //     this.processing = false;
  //     return;
  //   }

  //   this.tradingApiService
  //     .placeOrder(this.symbol, 'buy', this.activeOrderType, amount, price, triggerPrice)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         if (response.success) {
  //           this.successMessage = response.message;
  //           this.clearBuyForm();
  //         } else {
  //           this.errorMessage = response.message;
  //         }
  //         this.processing = false;
  //         this.autoHideMessages();
  //       },
  //       error: (error) => {
  //         this.errorMessage = error.message || 'Failed to place buy order';
  //         this.processing = false;
  //         this.autoHideMessages();
  //       },
  //     });
  // }

  // placeSellOrder() {
  //   this.clearMessages();
  //   this.processing = true;

  //   const amount = parseFloat(this.sellAmount);
  //   const price = this.activeOrderType === 'market' ? this.currentPrice : parseFloat(this.sellPrice);
  //   const triggerPrice = this.sellTriggerPrice ? parseFloat(this.sellTriggerPrice) : undefined;

  //   if (!amount || amount <= 0) {
  //     this.errorMessage = 'Please enter a valid amount';
  //     this.processing = false;
  //     return;
  //   }

  //   if (this.activeOrderType !== 'market' && (!price || price <= 0)) {
  //     this.errorMessage = 'Please enter a valid price';
  //     this.processing = false;
  //     return;
  //   }

  //   this.tradingApiService
  //     .placeOrder(this.symbol, 'sell', this.activeOrderType, amount, price, triggerPrice)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response) => {
  //         if (response.success) {
  //           this.successMessage = response.message;
  //           this.clearSellForm();
  //         } else {
  //           this.errorMessage = response.message;
  //         }
  //         this.processing = false;
  //         this.autoHideMessages();
  //       },
  //       error: (error) => {
  //         this.errorMessage = error.message || 'Failed to place sell order';
  //         this.processing = false;
  //         this.autoHideMessages();
  //       },
  //     });
  // }

  private clearBuyForm() {
    this.buyAmount = '';
    this.buyTriggerPrice = '';
    this.buyTotal = 0;
    this.buyFee = 0;
  }

  private clearSellForm() {
    this.sellAmount = '';
    this.sellTriggerPrice = '';
    this.sellTotal = 0;
    this.sellFee = 0;
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

  private autoHideMessages() {
    setTimeout(() => {
      this.clearMessages();
    }, 5000);
  }

  get baseAsset(): string {
    return this.symbol.replace('USDT', '');
  }

  get quoteAsset(): string {
    return 'USDT';
  }
}
