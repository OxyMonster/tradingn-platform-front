import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { TradingApiService, OrderType, ApiBalance } from '../../services/trading-api.service';
import { TickerData } from '../../services/websocket.service';
import { UtilsService } from '../../../../../../../core/services/utils.service';
import { ClientsService } from '../../../../../../admin/admin/components/admin-clients/services/clients.service';

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
  @Input() set ticker(value: TickerData | null) {
    if (value) {
      this._ticker = value;
      if (this.activeOrderType === 'limit' && !this.buyPrice) {
        this.buyPrice = value.price.toFixed(2);
        this.sellPrice = value.price.toFixed(2);
      }
      this.currentPrice = value.price;
    }
  }

  private tradingApiService = inject(TradingApiService);
  private destroy$ = new Subject<void>();

  activeOrderType: OrderType = 'market';
  private _ticker: TickerData | null = null;

  get ticker(): TickerData | null {
    return this._ticker;
  }

  // Balances
  baseAssetBalance: any = null;
  quoteAssetBalance: any = null;

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

  client: any;

  private readonly FEE_RATE = 0.001; // 0.1%

  constructor(
    private _utile: UtilsService,
    private _client: ClientsService,
    private _trading: TradingApiService
  ) {}

  ngOnInit() {
    this.getClient();
    // Subscribe to balances

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

  getClient() {
    const clientId = this._utile.getActiveUser().id;
    return this._client
      .getClient(clientId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.baseAssetBalance = res.data[0].usdt_balance;
        this.client = res.data[0];
      });
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
  placeBuyOrder() {
    this.clearMessages();
    this.processing = true;

    const amount = parseFloat(this.buyAmount);
    const price = this.activeOrderType === 'market' ? this.currentPrice : parseFloat(this.buyPrice);
    const triggerPrice = this.buyTriggerPrice ? parseFloat(this.buyTriggerPrice) : undefined;

    if (!amount || amount <= 0) {
      this.errorMessage = 'Please enter a valid amount';
      this.processing = false;
      return;
    }

    if (amount > this.baseAssetBalance?.total) {
      this.errorMessage = 'Insufficient balance';
      this.processing = false;
      return;
    }

    if (this.activeOrderType !== 'market' && (!price || price <= 0)) {
      this.errorMessage = 'Please enter a valid price';
      this.processing = false;
      return;
    }
    const payload = {
      clientId: this.client._id,
      workerId: this.client.workerId,
      pair: this.symbol,
      orderType: 'buy',
      volume: amount,
      entryPrice: price * amount,
      currentPrice: price,
      profit: 0,
      dateCreated: Date.now(),
      dateClosed: Date.now(),
      status: 'closed',
    };
    console.log(payload);
    return this._trading.closeOrder(payload).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error('Error closing order:', err);
      }
    );

    // this.tradingApiService
    //   .placeOrder(this.symbol, 'buy', this.activeOrderType, amount, price, triggerPrice)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (response) => {
    //       if (response.success) {
    //         this.successMessage = response.message;
    //         this.clearBuyForm();
    //       } else {
    //         this.errorMessage = response.message;
    //       }
    //       this.processing = false;
    //       this.autoHideMessages();
    //     },
    //     error: (error) => {
    //       this.errorMessage = error.message || 'Failed to place buy order';
    //       this.processing = false;
    //       this.autoHideMessages();
    //     },
    //   });
  }

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
