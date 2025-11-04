import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'app-crypto-ticker-header',
  imports: [],
  templateUrl: './crypto-ticker-header.html',
  styleUrl: './crypto-ticker-header.scss',
})
export class CryptoTickerHeader {
  currency = signal<string>('');

  @Input() set selectedCurrency(value: string) {
    this.currency.set(value);
  }
}
