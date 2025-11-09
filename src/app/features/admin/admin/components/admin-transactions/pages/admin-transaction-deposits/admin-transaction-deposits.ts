import { Component } from '@angular/core';
import { LoadingComponent } from '../../../../../../../shared/components/loading/loading/loading';
import { AdminTransactionsTable } from '../../components/admin-transactions-table/admin-transactions-table';

@Component({
  selector: 'app-admin-transaction-deposits',
  imports: [LoadingComponent, AdminTransactionsTable],
  templateUrl: './admin-transaction-deposits.html',
  styleUrls: ['./admin-transaction-deposits.scss'],
})
export class AdminTransactionDeposits {}
