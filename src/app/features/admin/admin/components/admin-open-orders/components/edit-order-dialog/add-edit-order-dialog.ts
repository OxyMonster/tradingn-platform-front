import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OpenOrder } from '../../admin-open-orders.component';

interface Client {
  _id: string;
  name: string;
  email: string;
}

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
export class AddEditOrderDialog implements OnInit {
  order: OpenOrder;
  clients: any = [];
  cryptoPairs: any = [];
  originalOrder: OpenOrder;
  private isCalculating = false; // Prevent circular updates
  modalType: 'add' | 'edit' = 'edit';

  filteredClients: Client[] = [];
  clientSearchText: string = '';

  constructor(
    private dialogRef: MatDialogRef<AddEditOrderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any | null
  ) {
    console.log(this.data);
    this.clients = this.data.clients;
    this.cryptoPairs = this.data.cryptoPairs;

    // Check if we're adding or editing
    if (data.order) {
      // Edit mode
      this.modalType = 'edit';
      this.order = this.data.order;
      console.log('hereee');

      this.originalOrder = { ...data };
    } else {
      // Add mode - create new empty order
      this.modalType = 'add';
      this.order = this.createEmptyOrder();
      this.originalOrder = this.createEmptyOrder();
    }
  }

  ngOnInit() {
    // Initialize filtered clients
    this.filteredClients = [...this.clients];
    // Calculate initial profit if editing
    if (this.modalType === 'edit') {
      this.calculateProfit();
    }
  }

  /**
   * Create an empty order for add mode
   */
  private createEmptyOrder(): OpenOrder {
    return {
      id: '',
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
          client.name.toLowerCase().includes(search) ||
          client.email.toLowerCase().includes(search) ||
          client.id.toLowerCase().includes(search)
      );
    }
  }

  /**
   * Called when client is selected
   */
  onClientChange(clientId: string) {
    const client = this.clients.find((c: any) => c.id === clientId);
    if (client) {
      this.order.clientId = client.id;
      this.order.clientName = client.name;
    }
  }

  /**
   * Called when cryptoPair is selected
   */
  onCryptoPairChange(pairId: string) {
    const selectedPair = this.cryptoPairs.find((c: any) => c.id === pairId);
    if (selectedPair) {
      this.order.pair = selectedPair.id;
    }
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
      this.order.id = 'order-' + Date.now();
      console.log('Adding new order:', this.order);
    } else {
      console.log('Updating order:', this.order);
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
}
