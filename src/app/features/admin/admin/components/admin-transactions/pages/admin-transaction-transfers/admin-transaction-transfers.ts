import { Component } from '@angular/core';
import { AdminTransactionsTable } from '../../components/admin-transactions-table/admin-transactions-table';

@Component({
  selector: 'app-admin-transaction-transfers',
  imports: [AdminTransactionsTable],
  templateUrl: './admin-transaction-transfers.html',
  styleUrls: ['./admin-transaction-transfers.scss', '../../../../admin.scss'],
})
export class AdminTransactionTransfers {}
