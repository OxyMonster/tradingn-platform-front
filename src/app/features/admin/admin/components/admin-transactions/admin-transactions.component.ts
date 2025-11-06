import { Component, OnDestroy, OnInit, Pipe, inject } from '@angular/core';
import { Subject, combineLatest, takeUntil } from 'rxjs';
import { AdminTransactionsService } from './services/admin-transactions.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddNewTransaction } from './components/add-new-transaction/add-new-transaction';
import { ClientsService } from '../admin-clients/services/clients.service';

@Component({
  selector: 'app-admin-transactions',
  templateUrl: './admin-transactions.component.html',
  styleUrls: ['../../admin.scss'],
  imports: [MatDialogModule],
})
export class AdminTransactionsComponent implements OnInit, OnDestroy {
  $destroy: Subject<void> = new Subject<void>();
  listOfTransactions: any = [];
  private dialog = inject(MatDialog);

  constructor(private _transactions: AdminTransactionsService, private _client: ClientsService) {}

  ngOnInit() {
    // this.getTransactions();
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddNewTransaction, {
      width: 'auto', // let content decide width
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        // Optionally refresh client list
      }
    });
  }

  onGroupSubscription() {
    combineLatest([this._transactions.getTransactions(), this._client.getAllClients()])
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: ([transactions, clients]) => {},
        error: (err) => console.error('Error fetching data', err),
      });
  }
}
