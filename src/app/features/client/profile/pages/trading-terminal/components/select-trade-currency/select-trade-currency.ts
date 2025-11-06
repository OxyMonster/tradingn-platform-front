import { Component, OnInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil, interval } from 'rxjs';

interface TradingPair {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  volume: number;
  icon: string;
}

@Component({
  selector: 'app-select-trade-currency',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-trade-currency.html',
  styleUrls: ['./select-trade-currency.scss'],
})
export class SelectTradeCurrencyComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();

  searchQuery = '';
  activeTab: 'favorites' | 'all' = 'all';
  allPairs: TradingPair[] = [];
  filteredPairs: TradingPair[] = [];
  favoritePairs: string[] = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT'];
  loading = true;

  // Popular pairs to show
  popularSymbols = [
    'BTCUSDT',
    'ETHUSDT',
    'BNBUSDT',
    'SOLUSDT',
    'XRPUSDT',
    'DOGEUSDT',
    'ADAUSDT',
    'DOTUSDT',
    'MATICUSDT',
    'AVAXUSDT',
    'LINKUSDT',
    'UNIUSDT',
    'ATOMUSDT',
    'LTCUSDT',
    'ETCUSDT',
    'TRXUSDT',
    'XLMUSDT',
    'VETUSDT',
    'ICPUSDT',
    'FILUSDT',
    'FTMUSDT',
    'SHIBUSDT',
    'NEARUSDT',
    'APTUSDT',
    'ARBUSDT',
    'OPUSDT',
    'INJUSDT',
    'SUIUSDT',
    'PEPEUSDT',
    'WLDUSDT',
    'MKRUSDT',
  ];

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.loadFavorites();
      this.fetchTradingPairs();

      // Refresh prices every 3 seconds
      interval(3000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.fetchTradingPairs();
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchTradingPairs() {
    // Fetch from Binance API
    // Don't use takeUntil here to prevent AbortError spam when parent component reconnects
    this.http.get<any>('https://api.binance.com/api/v3/ticker/24hr').subscribe({
      next: (data) => {
        // Filter only USDT pairs from popular list
        this.allPairs = data
          .filter((ticker: any) => this.popularSymbols.includes(ticker.symbol))
          .map((ticker: any) => ({
            symbol: ticker.symbol,
            baseAsset: ticker.symbol.replace('USDT', ''),
            quoteAsset: 'USDT',
            price: parseFloat(ticker.lastPrice),
            priceChange: parseFloat(ticker.priceChange),
            priceChangePercent: parseFloat(ticker.priceChangePercent),
            volume: parseFloat(ticker.volume),
            icon: this.getIcon(ticker.symbol),
          }))
          .sort((a: TradingPair, b: TradingPair) => b.volume - a.volume);

        this.filterPairs();
        this.loading = false;
      },
      error: (error) => {
        // Silently ignore AbortError and network errors
        if (error.name !== 'AbortError' && error.status !== 0) {
          console.error('Error fetching trading pairs:', error);
        }
        this.loading = false;
      },
    });
  }

  filterPairs() {
    let pairs = this.allPairs;

    // Filter by active tab
    if (this.activeTab === 'favorites') {
      pairs = pairs.filter((p) => this.favoritePairs.includes(p.symbol));
    }

    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      pairs = pairs.filter(
        (p) => p.symbol.toLowerCase().includes(query) || p.baseAsset.toLowerCase().includes(query)
      );
    }

    this.filteredPairs = pairs;
  }

  onSearchChange() {
    this.filterPairs();
  }

  switchTab(tab: 'favorites' | 'all') {
    this.activeTab = tab;
    this.filterPairs();
  }

  selectPair(symbol: string) {
    // Navigate to the trading terminal with the selected pair
    this.router.navigate(['/profile/spot', symbol]);
  }

  toggleFavorite(symbol: string, event: Event) {
    event.stopPropagation();

    const index = this.favoritePairs.indexOf(symbol);
    if (index > -1) {
      this.favoritePairs.splice(index, 1);
    } else {
      this.favoritePairs.push(symbol);
    }

    this.saveFavorites();
    this.filterPairs();
  }

  isFavorite(symbol: string): boolean {
    return this.favoritePairs.includes(symbol);
  }

  private loadFavorites() {
    if (!this.isBrowser) return;

    const saved = localStorage.getItem('favorite_pairs');
    if (saved) {
      this.favoritePairs = JSON.parse(saved);
    }
  }

  private saveFavorites() {
    if (!this.isBrowser) return;
    localStorage.setItem('favorite_pairs', JSON.stringify(this.favoritePairs));
  }

  private getIcon(symbol: string): string {
    const icons: { [key: string]: string } = {
      BTCUSDT: '₿',
      ETHUSDT: 'Ξ',
      BNBUSDT: '◆',
      SOLUSDT: '◎',
      XRPUSDT: '✕',
      DOGEUSDT: '🐕',
      ADAUSDT: '₳',
      DOTUSDT: '●',
      MATICUSDT: '⬡',
      AVAXUSDT: '▲',
      LINKUSDT: '🔗',
      UNIUSDT: '🦄',
      ATOMUSDT: '⚛',
      LTCUSDT: 'Ł',
      ETCUSDT: 'Ξ',
      TRXUSDT: '◉',
      XLMUSDT: '✦',
      VETUSDT: 'Ⓥ',
      ICPUSDT: '∞',
      FILUSDT: 'Ⅎ',
      FTMUSDT: '♦',
      SHIBUSDT: '🐶',
      NEARUSDT: 'Ⓝ',
      APTUSDT: 'Ⓐ',
      ARBUSDT: '◬',
      OPUSDT: '⭕',
      INJUSDT: '⚡',
      SUIUSDT: '~',
      PEPEUSDT: '🐸',
      WLDUSDT: '🌐',
      MKRUSDT: 'Ⓜ',
    };
    return icons[symbol] || '◆';
  }

  getCurrencyName(symbol: string): string {
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
      ATOMUSDT: 'Cosmos',
      LTCUSDT: 'Litecoin',
      ETCUSDT: 'Ethereum Classic',
      TRXUSDT: 'Tron',
      XLMUSDT: 'Stellar',
      VETUSDT: 'VeChain',
      ICPUSDT: 'Internet Computer',
      FILUSDT: 'Filecoin',
      FTMUSDT: 'Fantom',
      SHIBUSDT: 'Shiba Inu',
      NEARUSDT: 'Near Protocol',
      APTUSDT: 'Aptos',
      ARBUSDT: 'Arbitrum',
      OPUSDT: 'Optimism',
      INJUSDT: 'Injective',
      SUIUSDT: 'Sui',
      PEPEUSDT: 'Pepe',
      WLDUSDT: 'Worldcoin',
      MKRUSDT: 'Maker',
    };
    return names[symbol] || symbol.replace('USDT', '');
  }

  getCurrentSymbol(): string {
    if (!this.isBrowser) return '';
    const url = this.router.url;
    const match = url.match(/\/spot\/([A-Z]+)/);
    return match ? match[1] : 'BTCUSDT';
  }
}
