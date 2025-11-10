import { Component } from '@angular/core';
import { ClientTransactionsTable } from '../components/client-transactions-table/client-transactions-table';

@Component({
  selector: 'app-earnings',
  imports: [ClientTransactionsTable],
  templateUrl: './earnings.html',
  styleUrl: './earnings.scss',
})
export class EarningsComponent {}
