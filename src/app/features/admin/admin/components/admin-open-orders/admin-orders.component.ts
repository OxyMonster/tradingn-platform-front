import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminOpenOrdersComponent } from './components/admin-open-orders/admin-open-orders';
import { AdminClosedOrders } from './components/admin-closed-orders/admin-closed-orders';

export interface OpenOrder {
  _id?: string;
  clientId: any;
  clientName: string;
  pair: string;
  orderType: 'buy' | 'sell';
  balance: number;
  volume: number;
  pledge: number;
  leverage: number;
  entryPrice: number;
  currentPrice: number;
  profit: number;
  dateCreated: Date;
  dateClosed: Date | null;
}

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, AdminClosedOrders, AdminOpenOrdersComponent],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss'],
})
export class AdminOrdersComponent {
  orderPageTitle: string = 'Open Orders';
  activeTab: string = 'open';

  switchTab(tab: 'open' | 'history') {
    this.activeTab = tab;
    tab === 'open'
      ? (this.orderPageTitle = 'Open Orders')
      : (this.orderPageTitle = 'Order History');
  }
}
