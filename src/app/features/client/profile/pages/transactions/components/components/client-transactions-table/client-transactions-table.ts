import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UtilsService } from '../../../../../../../../core/services/utils.service';
import { AdminTransactionsService } from '../../../../../../../admin/admin/components/admin-transactions/services/admin-transactions.service';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../../../../../shared/components/loading/loading/loading';

@Component({
  selector: 'app-client-transactions-table',
  imports: [CommonModule, LoadingComponent],
  standalone: true,
  templateUrl: './client-transactions-table.html',
  styleUrl: './client-transactions-table.scss',
})
export class ClientTransactionsTable implements OnInit, OnDestroy {
  user: any = {};
  $destroy: Subject<void> = new Subject<void>();
  listOfTransactions: any = [];
  isLoading = true;
  @Input() type: string = 'deposit';

  constructor(private _transaction: AdminTransactionsService, private _utile: UtilsService) {
    this.user = this._utile.getActiveUser();
  }

  ngOnInit(): void {
    this.getTransactions();
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  getTransactions() {
    this.isLoading = true;
    return this._transaction
      .getTransactions(null, this.user.id, this.type)
      .pipe(takeUntil(this.$destroy))
      .subscribe(
        (data: any) => {
          this.listOfTransactions = data.data;
          this.isLoading = false;
          console.log(this.listOfTransactions.length);
        },
        (err) => {
          this.isLoading = false;
          console.log(err);
        }
      );
  }
}
