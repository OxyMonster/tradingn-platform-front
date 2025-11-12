import { Component, inject, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../../../shared/components/loading/loading/loading';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RegisterWorkers } from './component/register-workers/register-workers';
import { EditWorkers } from './component/edit-workers/edit-workers';
import { ChangeWorkerPassword } from './component/change-worker-password/change-worker-password';
import { AdminWorkersService } from './services/admin-workers.service';
import { Subject, takeUntil } from 'rxjs';
import { ChangePassword } from '../../../../../shared/components/change-password/change-password';

@Component({
  selector: 'app-admin-workers',
  templateUrl: './admin-workers.html',
  styleUrls: ['../../admin.scss'],
  standalone: true,
  imports: [LoadingComponent, MatDialogModule, ChangePassword],
})
export class AdminWorkersComponent implements OnInit {
  workersList: any[] = [];
  openDropdownId: string | null = null;
  private dialog = inject(MatDialog);
  $destroy = new Subject<void>();

  constructor(private _workersService: AdminWorkersService) {}

  ngOnInit() {
    this.getWorkers();
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

  openDialog(modalType: string, worker?: string) {
    if (modalType === 'register') {
      const dialogRef = this.dialog.open(RegisterWorkers, {
        width: '1000px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Dialog closed with result:', result);
          // Optionally refresh client list
          this.getWorkers();
        }
      });
      return;
    }
    if (modalType === 'edit') {
      const dialogRef = this.dialog.open(EditWorkers, {
        width: '1000px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: worker,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Dialog closed with result:', result);
          // Optionally refresh client list
          this.getWorkers();
        }
      });

      return;
    }

    if (modalType === 'change-password') {
      const dialogRef = this.dialog.open(ChangePassword, {
        width: '1200px',
        maxWidth: '95vw',
        maxHeight: '90vh',
        panelClass: 'custom-dialog-container',
        autoFocus: false,
        data: worker, // pass client to dialog
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('Dialog closed with result:', result);
          // Optionally refresh client list
          this.getWorkers();
        }
      });
      return;
    }
  }

  getWorkers() {
    return this._workersService
      .getWorkers()
      .pipe(takeUntil(this.$destroy))
      .subscribe((res: any) => {
        this.workersList = res.data;
        console.log(this.workersList);
      });
  }
}
