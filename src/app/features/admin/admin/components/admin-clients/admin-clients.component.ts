import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ClientsService } from './services/clients.service';
import { Subject, Subscription, forkJoin, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoadingComponent } from '../../../../../shared/components/loading/loading/loading';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditSelectedClientComponent } from './components/edit-selected-client/edit-selected-client.component';
import { RegisterNewClient } from './components/register-new-client/register-new-client';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { ChangeClientBalances } from './components/change-client-balances/change-client-balances';
import { AdminWorkersService } from '../admin-workers/services/admin-workers.service';
import { UtilsService } from '../../../../../core/services/utils.service';

@Component({
  selector: 'app-admin-clients',
  templateUrl: './admin-clients.component.html',
  styleUrls: ['../../admin.scss'],
  standalone: true,
  imports: [LoadingComponent, MatDialogModule, MatFormField, MatOption, MatLabel],
})
export class AdminClientsComponent implements OnInit, OnDestroy {
  clientsList: any = [];
  workersList: any = [];
  private destroy$ = new Subject<void>();
  private dialog = inject(MatDialog);
  openDropdownId: string | null = null;
  workerId!: string;
  activeUser!: any;

  constructor(
    private _clients: ClientsService,
    private _workers: AdminWorkersService,
    private _utils: UtilsService
  ) {}

  ngOnInit() {
    this.activeUser = this._utils.getActiveUser();

    if (this.activeUser.role === 'admin') {
      this.groupSubForAdmin();
    } else {
      this.groupSubForWorker();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  toggleDropdown(clientId: string, event: Event) {
    event.stopPropagation();
    if (this.openDropdownId === clientId) {
      this.openDropdownId = null;
      document.removeEventListener('click', this.handleClickOutside.bind(this));
    } else {
      this.openDropdownId = clientId;
      setTimeout(() => {
        document.addEventListener('click', this.handleClickOutside.bind(this));
      }, 0);
    }
  }

  closeDropdown() {
    this.openDropdownId = null;
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  private handleClickOutside() {
    this.closeDropdown();
  }

  groupSubForAdmin() {
    forkJoin<[any, any]>([this.getClients(), this.getWorkers()])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([clients, workers]) => {
          this.clientsList = clients;
          this.workersList = workers.data;
        },
        error: (err) => console.error('Error fetching data', err),
      });
  }

  groupSubForWorker() {
    forkJoin<[any, any]>([this._clients.getClientsForWorker(this.activeUser.id), this.getWorkers()])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([clients, workers]) => {
          this.clientsList = clients.data;
          this.workersList = workers.data;
        },
        error: (err) => console.error('Error fetching data', err),
      });
  }

  getWorkers() {
    return this._workers.getWorkers();
  }

  getClients() {
    return this._clients.getAllClients();
  }

  openDialog(modalType: string, client?: any) {
    if (modalType === 'register') {
      const dialogRef = this.dialog.open(RegisterNewClient, {
        width: '1000px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: this.workersList, // pass client to dialog
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Optionally refresh client list
          if (this.activeUser.role === 'admin') {
            this.groupSubForAdmin();
          } else {
            this.groupSubForWorker();
          }
        }
      });
      return;
    }
    if (modalType === 'edit-client') {
      const dialogRef = this.dialog.open(EditSelectedClientComponent, {
        width: '1000px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: { client, workers: this.workersList }, // pass client to dialog
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (this.activeUser.role === 'admin') {
            this.groupSubForAdmin();
          } else {
            this.groupSubForWorker();
          }
        }
      });

      return;
    }
    if (modalType === 'change-balances') {
      const dialogRef = this.dialog.open(ChangeClientBalances, {
        width: '1000px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: { client, workers: this.workersList }, // pass client to dialog
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          if (this.activeUser.role === 'admin') {
            this.groupSubForAdmin();
          } else {
            this.groupSubForWorker();
          }
        }
      });

      return;
    }
  }
}
