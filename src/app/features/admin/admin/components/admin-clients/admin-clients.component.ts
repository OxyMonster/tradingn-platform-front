import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ClientsService } from './services/clients.service';
import { Subject, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../../shared/components/loading/loading/loading';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditSelectedClientComponent } from './components/edit-selected-client/edit-selected-client.component';
import { RegisterNewClient } from './components/register-new-client/register-new-client';

@Component({
  selector: 'app-admin-clients',
  templateUrl: './admin-clients.component.html',
  styleUrls: ['../../admin.scss'],
  standalone: true,
  imports: [AsyncPipe, LoadingComponent, MatDialogModule],
})
export class AdminClientsComponent implements OnInit, OnDestroy {
  clientsList: any[] = [];
  private destroy$ = new Subject<void>();
  private dialog = inject(MatDialog);

  constructor(private _clients: ClientsService) {}

  ngOnInit() {
    this.getClients();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getClients() {
    this._clients
      .getAllClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe((clients: any) => {
        this.clientsList = clients;
        console.log(this.clientsList);
      });
  }

  openDialog(isRegisterDIalog: boolean, client?: any) {
    if (isRegisterDIalog) {
      const dialogRef = this.dialog.open(RegisterNewClient, {
        width: 'auto', // let content decide width
        height: 'auto',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: client, // pass client to dialog
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Dialog closed with result:', result);
          // Optionally refresh client list
          this.getClients();
        }
      });
    } else {
      const dialogRef = this.dialog.open(EditSelectedClientComponent, {
        width: 'auto', // let content decide width
        height: 'auto',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: client, // pass client to dialog
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Dialog closed with result:', result);
          // Optionally refresh client list
          this.getClients();
        }
      });
    }
  }
}
