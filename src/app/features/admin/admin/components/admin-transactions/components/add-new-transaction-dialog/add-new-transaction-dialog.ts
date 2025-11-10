import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminTransactionsService } from '../../services/admin-transactions.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { BinancePriceService } from '../../../../../../../core/services/binance-price.service';

@Component({
  selector: 'app-add-new-transaction-dilaog',
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
  ],
  templateUrl: './add-new-transaction-dialog.html',
  styleUrl: './add-new-transaction-dialog.scss',
})
export class AddNewTransaction implements OnInit {
  form!: FormGroup;
  clients: any[] = [];
  cryptoPairs: any[] = [];
  isLoadingPrice!: boolean;

  ngOnInit(): void {
    this.clients = this.data.clients || [];
    this.cryptoPairs = this.data.cryptoPairs || [];
    this.form.patchValue({ type: this.data.transactionType });
  }
  constructor(
    private fb: FormBuilder,
    private _transactions: AdminTransactionsService,
    private dialogRef: MatDialogRef<AddNewTransaction>,
    private binancePriceService: BinancePriceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      client: ['', Validators.required],
      currency: ['', Validators.required],
      amount: ['', Validators.required],
      status: ['', Validators.required],
      type: ['', Validators.required],
      priceInUsd: [''],
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
        this.saveChanges();
      },
      (error) => {
        console.error('Error creating transaction', error);
      }
    );
  }

  refreshPrice() {
    if (!this.form.value.currency && this.form.value.amount) return;

    const symbol = this.cryptoPairs.filter(
      (pair) => pair.base_asset === this.form.value.currency
    )[0]?.symbol;
    console.log(symbol);

    this.isLoadingPrice = true;

    this.binancePriceService.fetchPrice(symbol).subscribe({
      next: (data: any) => {
        const price = parseFloat(data.price);
        this.form.patchValue({ priceInUsd: price * this.form.value.amount });

        this.isLoadingPrice = false;
      },
      error: (error) => {
        console.error('Error fetching price:', error);
        this.isLoadingPrice = false;
      },
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
