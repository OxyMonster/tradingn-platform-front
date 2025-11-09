import { Component, Input, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { UtilsService } from '../../../../../../../core/services/utils.service';
import { MarketsService } from '../../../../../../client/landing/pages/markets/services/market.service';
import { ClientsService } from '../../../admin-clients/services/clients.service';
import { AdminTransactionsService } from '../../services/admin-transactions.service';
import { AddNewTransaction } from '../add-new-transaction-dialog/add-new-transaction-dialog';

@Component({
  selector: 'app-admin-transactions-table',
  imports: [],
  standalone: true,
  templateUrl: './admin-transactions-table.html',
  styleUrls: ['./admin-transactions-table.scss', '../../../../admin.scss'],
})
export class AdminTransactionsTable {
  @Input() transactionType: string = 'deposit';
  $destroy: Subject<void> = new Subject<void>();
  listOfTransactions: any = [];
  transactions: any[] = [];
  clients: any[] = [];
  cryptoPairs: any = [];
  private dialog = inject(MatDialog);

  constructor(
    private _transactions: AdminTransactionsService,
    private _client: ClientsService,
    private _utile: UtilsService,
    private _market: MarketsService
  ) {}

  ngOnInit() {
    // this.getTransactions();
    if (this._utile.getActiveUser().role === 'admin') {
      this.groupSubForAdmin();
    } else {
      this.groupSubForWorker();
    }
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  openAddDepositDialog() {
    console.log({
      transactionType: this.transactionType,
      clients: this.clients,
      cryptoPairs: this.cryptoPairs,
    });

    const dialogRef = this.dialog.open(AddNewTransaction, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      data: {
        transactionType: 'deposit',
        clients: this.clients,
        cryptoPairs: this.cryptoPairs,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        if (this._utile.getActiveUser().role === 'admin') {
          this.groupSubForAdmin();
        } else {
          this.groupSubForWorker();
        }
      }
    });
  }

  groupSubForAdmin() {
    combineLatest<[any, any, any]>([
      this._transactions.getTransactions(),
      this._client.getAllClients(),
      this._market.getCryptoPairs(),
    ])
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: ([transactions, clients, cryptoPairs]) => {
          this.clients = clients;
          this.cryptoPairs = cryptoPairs;
          this.transactions = transactions.data.filter(
            (transaction: any) => transaction.type === this.transactionType
          );
        },
        error: (err) => console.error('Error fetching data', err),
      });
  }

  groupSubForWorker() {
    combineLatest<[any, any, any]>([
      this._transactions.getTransactions(),
      this._client.getClientsForWorker(this._utile.getActiveUser().id),
      this._market.getCryptoPairs(),
    ])
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: ([transactions, clients, cryptoPairs]) => {
          this.clients = clients.data;
          this.cryptoPairs = cryptoPairs;
          this.transactions = transactions.data.filter(
            (transaction: any) => transaction.type === this.transactionType
          );
        },
        error: (err) => console.error('Error fetching data', err),
      });
  }
}
