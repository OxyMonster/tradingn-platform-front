import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ClientsService } from '../../services/clients.service';
import { UtilsService } from '../../../../../../../core/services/utils.service';

interface Client {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-register-new-client',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './register-new-client.html',
  styleUrl: './register-new-client.scss',
})
export class RegisterNewClient implements OnInit {
  form!: FormGroup;

  filteredWorkers: any[] = [];
  workerSearchText: string = '';
  selectedClientName: string = '';
  workersList: any = [];
  activeUserRole!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterNewClient>,
    private _clients: ClientsService,
    private _utils: UtilsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.workersList = this.data || [];
    this.form = this.fb.group({
      workerId: [''],
      firstName: ['client', Validators.required],
      lastName: ['client', Validators.required],
      email: ['client@example.com', Validators.required],
      password: ['Password753951!', Validators.required],
    });
  }

  ngOnInit() {
    // Initialize filtered clients
    this.filteredWorkers = [...this.workersList];
    this.activeUserRole = this._utils.getActiveUser().role;
    this.form.patchValue({ workerId: this._utils.getActiveUser().id });
  }

  /**
   * Filter clients based on search text
   */
  filterClients() {
    const search = this.workerSearchText.toLowerCase().trim();
    if (!search) {
      this.filteredWorkers = [...this.workersList];
    } else {
      this.filteredWorkers = this.workersList.filter(
        (worker: any) =>
          worker.firstName.toLowerCase().includes(search) ||
          worker.lastName.toLowerCase().includes(search) ||
          worker.email.toLowerCase().includes(search) ||
          worker._id.toLowerCase().includes(search)
      );
    }
  }

  /**
   * Called when client is selected
   */
  onWorkerChange(workerId: string) {
    const client = this.workersList.find((c: any) => c._id === workerId);
    if (client) {
      this.selectedClientName = client.name;
    }
  }

  onFormSubmit() {
    if (this.form.valid) {
      this.onRegisterClient();
    }
  }

  onRegisterClient() {
    console.log(this.form.valid);

    const payload = this.form.value;
    return this._clients.registerClient(payload).subscribe((res) => {
      this.saveChanges();
    });
  }

  saveChanges() {
    // Do something, then close dialog and send back data
    this.dialogRef.close({ updated: true });
  }

  cancel() {
    this.dialogRef.close(); // closes without data
  }
}
