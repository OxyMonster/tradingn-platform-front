import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionsNavigation } from './components/transactions-navigation/transactions-navigation';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [RouterModule, TransactionsNavigation],
  templateUrl: './transactions.html',
  styleUrl: './transactions.scss',
})
export class TransactionsComponent {}
