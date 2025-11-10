import { AdminTransactionsService } from './../../../../../../admin/admin/components/admin-transactions/services/admin-transactions.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from '../../../../../../../core/services/utils.service';
import { Subject, takeUntil } from 'rxjs';
import { ClientTransactionsTable } from '../components/client-transactions-table/client-transactions-table';

@Component({
  selector: 'app-deposits',
  imports: [CommonModule, ClientTransactionsTable],
  templateUrl: './deposits.html',
  styleUrl: './deposits.scss',
  standalone: true,
})
export class DepositsComponent implements OnInit {
  user: any = {};
  $destroy: Subject<void> = new Subject<void>();
  listOfTransactions: any = [];
  isLoading!: boolean;

  constructor(private _transaction: AdminTransactionsService, private _utile: UtilsService) {
    this.user = this._utile.getActiveUser();
  }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions() {
    this.isLoading = true;
    return this._transaction
      .getTransactions(null, this.user.id, 'deposit')
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (data: any) => {
          this.listOfTransactions = data.data;
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          console.log(err);
        }
      );
  }
}
