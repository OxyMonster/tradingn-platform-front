import { Component } from '@angular/core';
import { AdminTransactionsTable } from '../../components/admin-transactions-table/admin-transactions-table';

@Component({
  selector: 'app-admin-transaction-withdrawals',
  imports: [AdminTransactionsTable],
  templateUrl: './admin-transaction-withdrawals.html',
  styleUrls: ['./admin-transaction-withdrawals.scss', '../../../../admin.scss'],
})
export class AdminTranasctionWithdrawalsComponent {}
