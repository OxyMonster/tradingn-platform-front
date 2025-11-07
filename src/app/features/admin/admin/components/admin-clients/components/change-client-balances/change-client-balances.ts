import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';

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
  balances: Balance[] = [];
  filteredBalances: Balance[] = [];
  selectedFilter: string = 'all';
  editingBalance: string | null = null;
  originalBalance: Balance | null = null;

  constructor(
    private dialogRef: MatDialogRef<ChangeClientBalances>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.clientData = data;
  }

  ngOnInit() {
    // Initialize with dummy balance data
    this.balances = [
      {
        currency: 'BTC',
        name: 'Bitcoin',
        type: 'crypto',
        icon: '₿',
        available: 2.45678912,
        inOrders: 0.12345678,
      },
      {
        currency: 'ETH',
        name: 'Ethereum',
        type: 'crypto',
        icon: 'Ξ',
        available: 15.87654321,
        inOrders: 2.34567891,
      },
      {
        currency: 'USDT',
        name: 'Tether',
        type: 'stablecoin',
        icon: '₮',
        available: 50000.0,
        inOrders: 5000.0,
      },
      {
        currency: 'USDC',
        name: 'USD Coin',
        type: 'stablecoin',
        icon: '$',
        available: 25000.0,
        inOrders: 0.0,
      },
      {
        currency: 'BNB',
        name: 'Binance Coin',
        type: 'crypto',
        icon: 'Ⓑ',
        available: 45.12345678,
        inOrders: 10.5,
      },
      {
        currency: 'XRP',
        name: 'Ripple',
        type: 'crypto',
        icon: '✕',
        available: 10000.0,
        inOrders: 1500.0,
      },
      {
        currency: 'ADA',
        name: 'Cardano',
        type: 'crypto',
        icon: '₳',
        available: 8000.12345,
        inOrders: 200.0,
      },
      {
        currency: 'SOL',
        name: 'Solana',
        type: 'crypto',
        icon: '◎',
        available: 150.75,
        inOrders: 25.5,
      },
      {
        currency: 'DOT',
        name: 'Polkadot',
        type: 'crypto',
        icon: '●',
        available: 500.123,
        inOrders: 50.0,
      },
      {
        currency: 'DOGE',
        name: 'Dogecoin',
        type: 'crypto',
        icon: 'Ð',
        available: 50000.0,
        inOrders: 5000.0,
      },
      {
        currency: 'USD',
        name: 'US Dollar',
        type: 'fiat',
        icon: '$',
        available: 100000.0,
        inOrders: 0.0,
      },
      {
        currency: 'EUR',
        name: 'Euro',
        type: 'fiat',
        icon: '€',
        available: 50000.0,
        inOrders: 0.0,
      },
    ];

    this.filteredBalances = [...this.balances];
  }

  filterBalances(filter: string) {
    this.selectedFilter = filter;

    if (filter === 'all') {
      this.filteredBalances = [...this.balances];
    } else if (filter === 'crypto') {
      this.filteredBalances = this.balances.filter((b) => b.type === 'crypto');
    } else if (filter === 'fiat') {
      this.filteredBalances = this.balances.filter((b) => b.type === 'fiat');
    } else if (filter === 'stablecoins') {
      this.filteredBalances = this.balances.filter((b) => b.type === 'stablecoin');
    }
  }

  editBalance(balance: Balance) {
    this.editingBalance = balance.currency;
    // Store original values in case user cancels
    this.originalBalance = { ...balance };
  }

  saveBalance(balance: Balance) {
    console.log('Saving balance:', balance);
    // Here you would call your API to save the balance
    this.editingBalance = null;
    this.originalBalance = null;
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
