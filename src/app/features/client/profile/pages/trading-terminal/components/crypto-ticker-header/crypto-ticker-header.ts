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

  getBaseCurrency(pair: string): string {
    if (!pair) return '';
    // Match letters until the last 3–4 uppercase letters (the quote part)
    const match = pair.match(
      /^([A-Z]+?)(USDT|FDUSD|BUSD|USDC|DAI|BTC|ETH|EUR|USD|TRY|TUSD|BNB|XRP|SOL)?$/i
    );
    return match ? match[1] : pair;
  }
}
