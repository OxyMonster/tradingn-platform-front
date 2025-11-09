import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OpenOrder } from '../../admin-orders.component';
import { BinancePriceService } from '../../../../../../../core/services/binance-price.service';
import { TradingApiService } from '../../../../../../client/profile/pages/trading-terminal/services/trading-api.service';

@Component({
  selector: 'app-edit-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './add-edit-order-dialog.html',
  styleUrl: './add-edit-order-dialog.scss',
})
export class AddEditOrderDialog implements OnInit, OnDestroy {
  order: OpenOrder;
  clients: any = [];
  cryptoPairs: any = [];
  originalOrder: OpenOrder;
  private isCalculating = false; // Prevent circular updates
  modalType: 'add' | 'edit' = 'edit';
  dialogType!: string;

  filteredClients: any[] = [];
  clientSearchText: string = '';
  isLoadingPrice: boolean = false;
  priceUpdateEnabled: boolean = true; // Toggle for real-time updates

  constructor(
    private dialogRef: MatDialogRef<AddEditOrderDialog>,
    private binancePriceService: BinancePriceService,
    private _trading: TradingApiService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Check if we're adding or editing
    if (data?.order) {
      // Edit mode
      this.modalType = 'edit';
      this.order = this.data.order;

      this.originalOrder = { ...data };
    } else {
      // Add mode - create new empty order
      this.modalType = 'add';
      this.order = this.createEmptyOrder();
      this.originalOrder = this.createEmptyOrder();
    }
  }

  ngOnInit() {
    console.log(this.data);

    if (this.data) {
      this.clients = this.data.clients || [];
      this.cryptoPairs = this.data.cryptoPairs || [];
    }

    // Initialize filtered clients
    this.filteredClients = [...this.clients];

    // Calculate initial profit if editing
    if (this.modalType === 'edit') {
      this.calculateProfit();
    }

    // Fetch real-time price if pair is already selected
    if (this.order.pair) {
      this.fetchAndUpdatePrice();
    }
  }

  /**
   * Create an empty order for add mode
   */
  private createEmptyOrder(): OpenOrder {
    return {
      clientId: '',
      clientName: '',
      pair: '',
      orderType: 'buy',
      balance: 0,
      volume: 0,
      pledge: 0,
      leverage: 10,
      entryPrice: 0,
      currentPrice: 0,
      profit: 0,
      dateCreated: new Date(),
      dateClosed: null,
    };
  }

  /**
   * Filter clients based on search text
   */
  filterClients() {
    const search = this.clientSearchText.toLowerCase().trim();
    if (!search) {
      this.filteredClients = [...this.clients];
    } else {
      this.filteredClients = this.clients.filter(
        (client: any) =>
          client.firstName.toLowerCase().includes(search) ||
          client.lastName.toLowerCase().includes(search) ||
          client.email.toLowerCase().includes(search) ||
          client._id.toLowerCase().includes(search)
      );
    }
  }

  /**
   * Called when client is selected
   */
  onClientChange(clientId: string) {
    const client = this.clients.find((c: any) => c._id === clientId);
    if (client) {
      this.order.clientId = client._id;
      this.order.clientName = client.name;
    }
  }

  /**
   * Called when cryptoPair is selected
   */
  onCryptoPairChange(pair: string) {
    const selectedPair = this.cryptoPairs.find((c: any) => c.symbol === pair);

    // console.log(selectedPair);
    if (selectedPair) {
      this.order.pair = selectedPair.symbol;

      // Fetch real-time price from Binance
      this.fetchAndUpdatePrice();
    }
  }

  /**
   * Fetch price from Binance and update entry price and current price
   */
  private fetchAndUpdatePrice() {
    console.log(this.order);

    if (!this.order.pair) return;

    this.isLoadingPrice = true;

    // Unsubscribe from previous pair if any
    this.binancePriceService.unsubscribeAll();

    // Subscribe to real-time price updates
    this.binancePriceService.subscribeToPrice(this.order.pair, (price: number) => {
      this.isLoadingPrice = false;

      // Update entry price only if it's 0 or in add mode
      // if (this.order.entryPrice === 0 || this.modalType === 'add') {
      //   this.order.entryPrice = price;
      //   this.calculatePledgeFromVolume();
      // }

      // Always update current price for real-time profit calculation
      if (this.priceUpdateEnabled) {
        this.order.currentPrice = price;
        this.calculateProfit();
      }
    });
  }

  /**
   * Manually refresh price from Binance
   */
  refreshPrice() {
    if (!this.order.pair) return;

    this.isLoadingPrice = true;

    this.binancePriceService.fetchPrice(this.order.pair).subscribe({
      next: (data: any) => {
        const price = parseFloat(data.price);
        this.order.entryPrice = price;
        this.order.currentPrice = price;
        this.isLoadingPrice = false;
        this.calculatePledgeFromVolume();
        this.calculateProfit();
      },
      error: (error) => {
        console.error('Error fetching price:', error);
        this.isLoadingPrice = false;
      },
    });
  }

  /**
   * Calculate profit based on the formula:
   * BUY/LONG: Profit = (Current Price - Entry Price) × Volume
   * SELL/SHORT: Profit = (Entry Price - Current Price) × Volume
   */
  calculateProfit() {
    if (this.order.volume && this.order.entryPrice && this.order.currentPrice) {
      let priceDifference: number;

      if (this.order.orderType === 'buy') {
        // Long position: profit when price goes UP
        priceDifference = this.order.currentPrice - this.order.entryPrice;
      } else {
        // Short position: profit when price goes DOWN
        priceDifference = this.order.entryPrice - this.order.currentPrice;
      }

      this.order.profit = priceDifference * this.order.volume;
    } else {
      this.order.profit = 0;
    }
  }

  /**
   * Calculate pledge from volume using leverage
   * Formula: Pledge = (Volume × Entry Price) / Leverage
   */
  calculatePledgeFromVolume() {
    if (this.isCalculating) return;
    this.isCalculating = true;

    if (this.order.volume && this.order.entryPrice && this.order.leverage) {
      const positionValue = this.order.volume * this.order.entryPrice;
      this.order.pledge = positionValue / this.order.leverage;
    } else {
      this.order.pledge = 0;
    }

    this.isCalculating = false;
  }

  /**
   * Calculate volume from pledge using leverage
   * Formula: Volume = (Pledge × Leverage) / Entry Price
   */
  calculateVolumeFromPledge() {
    if (this.isCalculating) return;
    this.isCalculating = true;

    if (this.order.pledge && this.order.entryPrice && this.order.leverage) {
      this.order.volume = (this.order.pledge * this.order.leverage) / this.order.entryPrice;
    } else {
      this.order.volume = 0;
    }

    this.isCalculating = false;
  }

  /**
   * Calculate the total position value
   * Position Value = Volume × Entry Price
   */
  get positionValue(): number {
    if (this.order.volume && this.order.entryPrice) {
      return this.order.volume * this.order.entryPrice;
    }
    return 0;
  }

  /**
   * Calculate ROI (Return on Investment) as a percentage
   * ROI% = (Profit / Pledge) × 100
   */
  get roi(): number {
    if (this.order.pledge && this.order.pledge !== 0) {
      return (this.order.profit / this.order.pledge) * 100;
    }
    return 0;
  }

  /**
   * Called when volume changes
   * Recalculates pledge and profit
   */
  onVolumeChange() {
    this.calculatePledgeFromVolume();
    this.calculateProfit();
  }

  /**
   * Called when pledge changes
   * Recalculates volume and profit
   */
  onPledgeChange() {
    this.calculateVolumeFromPledge();
    this.calculateProfit();
  }

  /**
   * Called when leverage changes
   * Recalculates pledge based on current volume
   */
  onLeverageChange() {
    this.calculatePledgeFromVolume();
  }

  /**
   * Called when entry price changes
   * Recalculates pledge and profit
   */
  onEntryPriceChange() {
    this.calculatePledgeFromVolume();
    this.calculateProfit();
  }

  /**
   * Called when current price changes to recalculate profit
   */
  onCurrentPriceChange() {
    this.calculateProfit();
  }

  /**
   * Called when order type changes (buy/sell)
   * Recalculates profit with the new direction
   */
  onOrderTypeChange() {
    this.calculateProfit();
  }

  onDateCreatedChange(value: string) {
    this.order.dateCreated = value ? new Date(value) : this.order.dateCreated;
  }

  onDateClosedChange(value: string) {
    this.order.dateClosed = value ? new Date(value) : null;
  }

  save() {
    if (this.modalType === 'add') {
      // Generate a new ID for the order
      this.onPlaceOrder();
    } else {
      this.onEditOrder(this.order);
    }

    // Here you would call your API to save/update the order
    console.log(this.order);
  }

  cancel() {
    this.dialogRef.close();
  }

  /**
   * Get the base currency from the trading pair
   */
  getBaseCurrency(): string {
    if (this.order.pair) {
      return this.order.pair.split('/')[0];
    }
    return '';
  }

  onPlaceOrder() {
    return this._trading.placeOrder(this.order).subscribe(
      (data) => {
        console.log('Order placed successfully', data);
        this.dialogRef.close(data);
      },
      (err) => {
        console.error('Error placing order', err);
      }
    );
  }

  onEditOrder(payload: any) {
    return this._trading.editOrder(payload).subscribe(
      (data) => {
        console.log('Order placed successfully', data);
        this.dialogRef.close(data);
      },
      (err) => {
        console.error('Error placing order', err);
      }
    );
  }

  /**
   * Clean up subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.binancePriceService.unsubscribeAll();
  }
}
