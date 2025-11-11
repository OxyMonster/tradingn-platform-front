import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerData } from '../../services/websocket.service';

@Component({
  selector: 'app-crypto-ticker-header',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './crypto-ticker-header.html',
  styleUrl: './crypto-ticker-header.scss',
})
export class CryptoTickerHeader {
  currency = signal<string>('');
  ticker = signal<TickerData | null>(null);

  @Input() set selectedCurrency(value: string) {
    this.currency.set(value);
  }

  @Input() set tickerInput(value: TickerData | null) {
    if (value) {
      this.ticker.set(value);
    }
  }

  getBaseCurrency(pair: string): string {
    if (!pair) return '';
    const match = pair.match(
      /^([A-Z]+?)(USDT|FDUSD|BUSD|USDC|DAI|BTC|ETH|EUR|USD|TRY|TUSD|BNB|XRP|SOL)?$/i
    );
    return match ? match[1] : pair;
  }

  getCurrencyName(pair: string): string {
    const names: { [key: string]: string } = {
      BTCUSDT: 'Bitcoin',
      ETHUSDT: 'Ethereum',
      BNBUSDT: 'BNB',
      SOLUSDT: 'Solana',
      XRPUSDT: 'Ripple',
      DOGEUSDT: 'Dogecoin',
      ADAUSDT: 'Cardano',
      DOTUSDT: 'Polkadot',
      MATICUSDT: 'Polygon',
      AVAXUSDT: 'Avalanche',
      LINKUSDT: 'Chainlink',
      UNIUSDT: 'Uniswap',
    };
    return names[pair] || this.getBaseCurrency(pair);
  }
}
