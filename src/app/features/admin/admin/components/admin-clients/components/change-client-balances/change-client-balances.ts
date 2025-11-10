import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ClientsService } from '../../services/clients.service';

interface Balance {
  currency: string;
  name: string;
  type: 'crypto' | 'fiat' | 'stablecoin';
  icon: string;
  available: number;
  inOrders: number;
}

@Component({
  selector: 'app-change-client-balances',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, DecimalPipe],
  templateUrl: './change-client-balances.html',
  styleUrl: './change-client-balances.scss',
})
export class ChangeClientBalances implements OnInit {
  clientData: any;
  balances: any[] = [];
  cryptoPairs: any[] = [];

  filteredBalances: any[] = [];
  selectedFilter: string = 'all';
  editingBalance: string | null = null;
  originalBalance: Balance | null = null;

  isLoading!: boolean;

  constructor(
    private dialogRef: MatDialogRef<ChangeClientBalances>,
    private _client: ClientsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientData = data.client;
  }

  ngOnInit() {
    console.log(this.data);
    this.cryptoPairs = this.data.cryptoPairs;
    // Initialize with dummy balance data

    this.filterIfPositiveBalance();
  }

  filterIfPositiveBalance() {
    this.filteredBalances = this.cryptoPairs.map((pair: any) => {
      const found = this.data.balances.find((item: any) => item.asset === pair.base_asset);
      console.log(found);

      return {
        ...pair,
        balance: found && found.amount > 0 ? found.amount : 0,
        addBalance: 0,
      };
    });
  }

  editBalance(balance: any) {
    this.editingBalance = balance.base_asset;
    // Store original values in case user cancels
    this.originalBalance = { ...balance };
  }

  saveBalance(balance: any) {
    console.log('Saving balance:', balance);
    // Here you would call your API to save the balance
    const payload = {
      clientId: this.data.client._id,
      asset: balance.base_asset,
      amount: balance.addBalance + balance.balance,
    };
    this._client.addUpdateBalance(payload.clientId, payload.asset, payload.amount).subscribe(
      (res: any) => {
        console.log(res);
        this.editingBalance = null;
        this.originalBalance = null;
      },
      (err: any) => {
        this.editingBalance = null;
        this.originalBalance = null;
      }
    );
  }

  cancelEdit() {
    if (this.editingBalance && this.originalBalance) {
      // Restore original values
      const balance = this.balances.find((b) => b.currency === this.editingBalance);
      if (balance) {
        balance.available = this.originalBalance.available;
        balance.inOrders = this.originalBalance.inOrders;
      }
    }
    this.editingBalance = null;
    this.originalBalance = null;
  }

  saveAllChanges() {
    console.log('Saving all changes:', this.balances);
    // Here you would call your API to save all balances
    this.dialogRef.close({ updated: true, balances: this.balances });
  }

  cancel() {
    this.dialogRef.close();
  }
}
