import { CryptoTickerHeader as CryptoTickerHeaderComponent } from './components/crypto-ticker-header/crypto-ticker-header';
// trading-terminal.component.ts
import { Component, PLATFORM_ID, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChartWidgetComponent } from './components/chart-widget/chart-widget';
import { Subject, takeUntil } from 'rxjs';
import {
  OrderBookComponent,
  OrderBookData,
  OrderBookEntry,
} from './components/order-book/order-book';
import { SelectTradeCurrencyComponent } from './components/select-trade-currency/select-trade-currency';
import { RecentTradesComponent } from './components/recent-trades/recent-trades';
import { OpenOrdersComponent } from './components/open-orders/open-orders';
import { BuySellComponent } from './components/buy-sell/buy-sell.component';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService, TickerData } from './services/websocket.service';
import { TradingApiService } from './services/trading-api.service';
import { UtilsService } from '../../../../../core/services/utils.service';

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
export class TradingTerminalComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private wsService = inject(WebSocketService);
  private tradingApiService = inject(TradingApiService);

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
  currentPrice = 0;
  ticker: TickerData | null = null;
  loading = true;
  error = '';
  wsConnected = false;

  private destroy$ = new Subject<void>();

  constructor(private route: ActivatedRoute, private _utile: UtilsService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Load initial trading data
      this.tradingApiService.loadBalances();
      this.tradingApiService.loadOpenOrders(this._utile.getActiveUser().id, null);
      this.tradingApiService.loadOrderHistory();
      // Get symbol from route and connect
      this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
        const symbol = params.get('id');
        const newSymbol = symbol ? symbol.toUpperCase() : 'BTCUSDT';
        // Only reconnect if symbol actually changed
        if (newSymbol !== this.selectedCurrency) {
          this.selectedCurrency = newSymbol;
          this.connectWebSocket();
        } else if (!this.wsConnected) {
          // First time initialization
          this.connectWebSocket();
        }
      });
      this.subscribeToWebSocketData();
    } else {
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.disconnect();
  }

  private connectWebSocket(): void {
    if (!this.isBrowser) return;
    this.wsService.connect(this.selectedCurrency);
  }

  private subscribeToWebSocketData(): void {
    // Subscribe to connection status
    this.wsService.connectionStatus$.pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.wsConnected = status;
      if (!status) {
        this.error = 'WebSocket disconnected. Reconnecting...';
      } else {
        this.error = '';
        this.loading = false;
      }
    });

    // Subscribe to ticker data
    this.wsService.ticker$.pipe(takeUntil(this.destroy$)).subscribe((ticker) => {
      if (ticker && ticker.symbol === this.selectedCurrency) {
        this.ticker = ticker;
        this.currentPrice = ticker.price;

        // Note: Order filling is handled by the backend automatically
        // The backend monitors prices and executes limit/stop-limit orders
      }
    });

    // Subscribe to order book data
    this.wsService.orderBook$.pipe(takeUntil(this.destroy$)).subscribe((orderBook) => {
      if (orderBook) {
        this.orderBookData = this.processOrderBookData(orderBook);
      }
    });
  }

  private processOrderBookData(data: any): OrderBookData {
    const processBids = (bids: [number, number][]): OrderBookEntry[] => {
      let cumulativeTotal = 0;
      return bids.map(([price, amount]) => {
        cumulativeTotal += amount;
        return { price, amount, total: cumulativeTotal };
      });
    };

    const processAsks = (asks: [number, number][]): OrderBookEntry[] => {
      let cumulativeTotal = 0;
      return asks.map(([price, amount]) => {
        cumulativeTotal += amount;
        return { price, amount, total: cumulativeTotal };
      });
    };

    return {
      bids: processBids(data.bids.slice(0, 20)),
      asks: processAsks(data.asks.slice(0, 20)),
    };
  }

  onCurrencyChange(symbol: string): void {
    if (!this.isBrowser) return;

    this.selectedCurrency = symbol;
    this.loading = true;
    this.error = '';
    this.wsService.changeSymbol(symbol);
  }
}
