import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminTransactionsService } from '../../services/admin-transactions.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { error } from 'console';

@Component({
  selector: 'app-add-new-transaction',
  imports: [ReactiveFormsModule, MatSelectModule, MatFormFieldModule, MatInputModule, MatOptionModule],
  templateUrl: './add-new-transaction.html',
  styleUrl: './add-new-transaction.scss',
})
export class AddNewTransaction {
  form!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _transactions: AdminTransactionsService,
    private dialogRef: MatDialogRef<AddNewTransaction>
  ) {
    this.form = this.fb.group({
      currency: ['', Validators.required],
      amount: ['', Validators.required],
      status: ['', Validators.required],
      type: ['', Validators.required],
      client: ['', Validators.required],
    });
  }

  onFormSubmit() {
    console.log(this.form.value);

    if (this.form.valid) {
      console.log('Form Submitted!', this.form.value);
      // Handle form submission logic here
      this.onCreateTransaction();
    } else {
      console.log('Form is invalid');
    }
  }

  onCreateTransaction() {
    return this._transactions.createTransaction(this.form.value).subscribe(
      (response) => {
        console.log('Transaction created successfully', response);
        this.saveChanges;
      },
      (error) => {
        console.error('Error creating transaction', error);
      }
    );
  }

  saveChanges() {
    // Do something, then close dialog and send back data
    this.dialogRef.close({ updated: true });
  }

  cancel() {
    this.dialogRef.close(); // closes without data
  }
}
