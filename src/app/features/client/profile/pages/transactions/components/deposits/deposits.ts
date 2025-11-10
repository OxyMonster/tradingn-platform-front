import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Deposit {
  txid: string;
  date: string;
  address: string;
  amount: number;
  currency: string;
  commission: number;
  type: string;
  status: 'completed' | 'in_processing' | 'canceled';
}

@Component({
  selector: 'app-deposits',
  imports: [CommonModule],
  templateUrl: './deposits.html',
  styleUrl: './deposits.scss',
  standalone: true,
})
export class DepositsComponent {
  deposits: Deposit[] = [
    {
      txid: '0x1234...5678',
      date: '2024-07-28T10:00:00Z',
      address: '0xabcd...efgh',
      amount: 1.25,
      currency: 'BTC',
      commission: 0.0001,
      type: 'Deposit',
      status: 'completed',
    },
    {
      txid: '0x9876...5432',
      date: '2024-07-27T14:30:00Z',
      address: '0xijkl...mnop',
      amount: 10,
      currency: 'ETH',
      commission: 0.001,
      type: 'Deposit',
      status: 'in_processing',
    },
    {
      txid: '0x5555...aaaa',
      date: '2024-07-26T09:00:00Z',
      address: '0xqrst...uvwx',
      amount: 1000,
      currency: 'USDT',
      commission: 1,
      type: 'Deposit',
      status: 'canceled',
    },
  ];
}
