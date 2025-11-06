import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { ClientsService } from '../../services/clients.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-selected-client',
  templateUrl: './edit-selected-client.component.html',
  styleUrls: ['./edit-selected-client.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
})
export class EditSelectedClientComponent implements OnInit {
  clientForm: FormGroup;
  clientId: any;

  constructor(
    private fb: FormBuilder,
    private _client: ClientsService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<EditSelectedClientComponent>
  ) {
    this.clientForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phone: [''],
      google_2fa_secret: [''],
      client_ip: [''],
      affiliation: [''],
      gender: [''],
      verification_level: [''],
      country: [''],
      worker: [''],
      is_vip: [false],
      is_banned: [false],
      overall_balance: [0],
    });
  }

  ngOnInit() {
    this.clientForm.patchValue(this.dialogData);
  }

  onFormSubmit() {
    console.log(this.clientForm.value);
    if (this.clientForm.valid) {
      this.onUpdateClient().subscribe(
        (response) => {
          this.saveChanges();
          console.log('Client updated successfully', response);
        },
        (error) => {
          console.error('Error updating client', error);
        }
      );
    }
  }

  onUpdateClient() {
    return this._client.updateClient(this.clientForm.value, this.dialogData._id);
  }

  saveChanges() {
    // Do something, then close dialog and send back data
    this.dialogRef.close({ updated: true, client: this.dialogData.client });
  }

  cancel() {
    this.dialogRef.close(); // closes without data
  }
}
