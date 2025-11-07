import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

export interface OpenOrder {
  id: string;
  clientId: string;
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
  selector: 'app-admin-open-orders',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './admin-open-orders.component.html',
  styleUrls: ['./admin-open-orders.component.scss'],
})
export class AdminOpenOrdersComponent implements OnInit, OnDestroy {
  orders: OpenOrder[] = [];
  openDropdownId: string | null = null;
  private dialog = inject(MatDialog);

  constructor() {}

  ngOnInit() {
    // Initialize with sample data
    this.orders = [
      {
        id: '1',
        clientId: 'client-001',
        clientName: 'John Doe',
        pair: 'BTC/USDT',
        orderType: 'buy',
        balance: 1.5,
        volume: 0.1,
        pledge: 920,
        leverage: 10,
        entryPrice: 92000,
        currentPrice: 91775,
        profit: -22.5,
        dateCreated: new Date('2025-01-15T10:30:00'),
        dateClosed: null,
      },
      {
        id: '2',
        clientId: 'client-002',
        clientName: 'Sarah Smith',
        pair: 'ETH/USDT',
        orderType: 'buy',
        balance: 5.75,
        volume: 2.5,
        pledge: 400,
        leverage: 20,
        entryPrice: 3200,
        currentPrice: 3218.1,
        profit: 45.25,
        dateCreated: new Date('2025-01-16T14:20:00'),
        dateClosed: null,
      },
      {
        id: '3',
        clientId: 'client-003',
        clientName: 'Michael Johnson',
        pair: 'SOL/USDT',
        orderType: 'sell',
        balance: 150.0,
        volume: 10.0,
        pledge: 35.1,
        leverage: 50,
        entryPrice: 175.5,
        currentPrice: 174.27,
        profit: 12.3,
        dateCreated: new Date('2025-01-17T09:15:00'),
        dateClosed: new Date('2025-01-18T16:45:00'),
      },
    ];
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  toggleDropdown(orderId: string, event: Event) {
    event.stopPropagation();
    if (this.openDropdownId === orderId) {
      this.openDropdownId = null;
      document.removeEventListener('click', this.handleClickOutside.bind(this));
    } else {
      this.openDropdownId = orderId;
      setTimeout(() => {
        document.addEventListener('click', this.handleClickOutside.bind(this));
      }, 0);
    }
  }

  closeDropdown() {
    this.openDropdownId = null;
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  private handleClickOutside() {
    this.closeDropdown();
  }

  openEditDialog(order?: OpenOrder) {
    // We'll import the AddEditOrderDialog component dynamically
    import('./components/edit-order-dialog/add-edit-order-dialog').then((m) => {
      const dialogRef = this.dialog.open(m.AddEditOrderDialog, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: order || null, // Pass null for add mode, order for edit mode
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (order) {
            // Edit mode - update existing order
            console.log('Order updated:', result);
            const index = this.orders.findIndex((o) => o.id === order.id);
            if (index !== -1) {
              this.orders[index] = result;
            }
          } else {
            // Add mode - add new order to the list
            console.log('Order added:', result);
            this.orders.unshift(result); // Add to the beginning of the list
          }
        }
      });
    });
  }

  closeOrder(order: OpenOrder) {
    console.log('Closing order:', order);
    // Here you would call your API to close the order
    order.dateClosed = new Date();
  }

  deleteOrder(order: OpenOrder) {
    console.log('Deleting order:', order);
    // Here you would call your API to delete the order
    this.orders = this.orders.filter((o) => o.id !== order.id);
  }

  cancelAll() {
    console.log('Canceling all orders');
    // Here you would call your API to cancel all orders
  }
}
