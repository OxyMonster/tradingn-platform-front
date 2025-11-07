import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { ClientsService } from '../admin-clients/services/clients.service';
import { UtilsService } from '../../../../../core/services/utils.service';
import { MarketsService } from '../../../../client/landing/pages/markets/services/market.service';
import { TradingApiService } from '../../../../client/profile/pages/trading-terminal/services/trading-api.service';

export interface OpenOrder {
  _id?: string;
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
  orders: any[] = [];
  clientsList: any = [];
  orderLIst: any = [];
  activeUser: any;
  cryptoPairs: any = [];

  openDropdownId: string | null = null;
  destroy$ = new Subject<void>();
  private dialog = inject(MatDialog);

  constructor(
    private _clients: ClientsService,
    private _utile: UtilsService,
    private _market: MarketsService,
    private _trading: TradingApiService
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }
  ngOnInit() {
    this.activeUser = this._utile.getActiveUser();

    if (this.activeUser.role === 'admin') {
      this.groupSubForAdmin();
    } else {
      this.groupSubForWorker();
    }
  }

  groupSubForAdmin() {
    let workeId = null;
    if (this.activeUser.role !== 'admin') {
      workeId = this.activeUser.id;
    }
    forkJoin<[any, any, any]>([
      this._clients.getAllClients(),
      this._market.getCryptoPairs(),
      this._trading.loadOpenOrders(null, workeId),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([clients, cryptoPairs, openOrders]) => {
          this.clientsList = clients;
          this.cryptoPairs = cryptoPairs;
          this.orderLIst = openOrders.data;
        },
        error: (err) => console.error('Error fetching data', err),
      });
  }

  groupSubForWorker() {
    forkJoin<[any, any]>([
      this._clients.getClientsForWorker(this.activeUser.id),
      this._market.getCryptoPairs(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([clients, cryptoPairs]) => {
          this.clientsList = clients.data;
          this.cryptoPairs = cryptoPairs;
        },
        error: (err) => console.error('Error fetching data', err),
      });
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

  openEditDialog(order?: any) {
    console.log('clientsList:', this.clientsList);
    console.log('cryptoPairs:', this.cryptoPairs);

    // Ensure data is loaded before opening dialog
    if (!this.clientsList || this.clientsList.length === 0) {
      console.error('Clients list is not loaded yet');
      return;
    }

    if (!this.cryptoPairs || this.cryptoPairs.length === 0) {
      console.error('Crypto pairs are not loaded yet');
      return;
    }

    // We'll import the AddEditOrderDialog component dynamically
    import('./components/edit-order-dialog/add-edit-order-dialog').then((m) => {
      const dialogRef = this.dialog.open(m.AddEditOrderDialog, {
        width: '800px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: {
          order,
          clients: this.clientsList,
          cryptoPairs: this.cryptoPairs,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (this.activeUser.role === 'admin') {
          this.groupSubForAdmin();
        } else {
          this.groupSubForWorker();
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
    this.orders = this.orders.filter((o) => o.id !== order._id);
  }

  cancelAll() {
    console.log('Canceling all orders');
    // Here you would call your API to cancel all orders
  }
}
