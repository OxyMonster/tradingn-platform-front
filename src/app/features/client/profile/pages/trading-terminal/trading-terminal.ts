import { CryptoTickerHeader as CryptoTickerHeaderComponent } from './components/crypto-ticker-header/crypto-ticker-header';
// trading-terminal.component.ts
import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartWidgetComponent } from './components/chart-widget/chart-widget';
import { HttpClient } from '@angular/common/http';
import { Subject, interval, takeUntil } from 'rxjs';
import {
  OrderBookComponent,
  OrderBookData,
  OrderBookEntry,
} from './components/order-book/order-book';
import { SelectTradeCurrencyComponent } from './components/select-trade-currency/select-trade-currency';
import { RecentTradesComponent } from './components/recent-trades/recent-trades';
import { OpenOrdersComponent } from './components/open-orders/open-orders';
import { BuySellComponent } from './components/buy-sell/buy-sell.component';
import { environment } from '../../../../../../environment.development';

@Component({
  selector: 'app-trading-terminal',
  standalone: true,
  imports: [
    CommonModule,
    ChartWidgetComponent,
    OrderBookComponent,
    CryptoTickerHeaderComponent,
    SelectTradeCurrencyComponent,
    RecentTradesComponent,
    OpenOrdersComponent,
    BuySellComponent,
  ],
  templateUrl: './trading-terminal.html',
  styleUrl: './trading-terminal.scss',
})
export class TradingTerminalComponent {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  selectedCurrency = 'BTCUSDT';
  currencyPairs = [
    'BTCUSDT',
    'ETHUSDT',
    'BNBUSDT',
    'ADAUSDT',
    'DOGEUSDT',
    'XRPUSDT',
    'SOLUSDT',
    'DOTUSDT',
  ];
  orderBookData: OrderBookData = { bids: [], asks: [] };
  loading = true;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient) {
    // Check if running in browser
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Only fetch data if running in browser
    if (this.isBrowser) {
      this.fetchOrderBook();
      this.startAutoRefresh();
    } else {
      // On server, just set loading to false so page can render
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCurrencyChange() {
    if (!this.isBrowser) return;

    this.loading = true;
    this.error = '';
    this.fetchOrderBook();
  }

  fetchOrderBook() {
    if (!this.isBrowser) return;

    // Correct URL with trailing slash
    const url = `${environment.apiUrl}/api/markets/orderbook/${this.selectedCurrency}/?limit=20`;

    this.http.get<any>(url).subscribe({
      next: (data) => {
        this.orderBookData = this.processOrderBookData(data.data);
        this.loading = false;
        this.error = '';
      },
      error: (err) => {
        this.error = 'Failed to fetch order book data';
        this.loading = false;
        console.error('Error fetching order book:', err);
      },
    });
  }

  processOrderBookData(data: any): OrderBookData {
    const processBids = (bids: any[]): OrderBookEntry[] => {
      let cumulativeTotal = 0;
      return bids.map(([price, amount]) => {
        const p = parseFloat(price);
        const a = parseFloat(amount);
        cumulativeTotal += a;
        return { price: p, amount: a, total: cumulativeTotal };
      });
    };

    const processAsks = (asks: any[]): OrderBookEntry[] => {
      let cumulativeTotal = 0;
      return asks.map(([price, amount]) => {
        const p = parseFloat(price);
        const a = parseFloat(amount);
        cumulativeTotal += a;
        return { price: p, amount: a, total: cumulativeTotal };
      });
    };

    return {
      bids: processBids(data.bids),
      asks: processAsks(data.asks),
    };
  }

  startAutoRefresh() {
    if (!this.isBrowser) return;

    interval(2000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (!this.loading) {
          this.fetchOrderBook();
        }
      });
  }
}
