import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { MarketsService } from '../../../../core/services/market.service';
import { TradingService } from '../../../../core/services/trading.service';
import { ChartWidgetComponent } from './components/chart-widget/chart-widget';
import { OpenOrdersComponent } from './components/open-orders/open-orders';
import { OrderBookComponent } from './components/order-book/order-book';
import { RecentTradesComponent } from './components/recent-trades/recent-trades';
import { TradeFormComponent } from './components/trade-form/trade-form';
import { Positionstablecomponent } from './components/positions-table/positions-table';

@Component({
  selector: 'app-trading-terminal',
  standalone: true,
  imports: [
    CommonModule,
    ChartWidgetComponent,
    OrderBookComponent,
    TradeFormComponent,
    OpenOrdersComponent,
    Positionstablecomponent,
    RecentTradesComponent,
  ],
  templateUrl: './trading-terminal.html',
  styleUrl: './trading-terminal.scss',
})
export class TradingTerminalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  symbol = signal<string>('BTCUSDT');
  currentPrice = signal<number>(0);
  priceChange24h = signal<number>(0);

  selectedTab = signal<'spot' | 'margin'>('spot');

  constructor(
    private route: ActivatedRoute,
    private tradingService: TradingService,
    private marketsService: MarketsService
  ) {}

  ngOnInit(): void {
    // Get symbol from query params
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const currency = params['currency'] || 'BTC';
      this.symbol.set(`${currency}USDT`);
    });

    // Initialize trading accounts
    this.initializeAccounts();

    // Load market data
    this.loadMarketData();

    // Start real-time updates
    this.startPriceUpdates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeAccounts(): void {
    this.tradingService
      .getAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.accounts.length === 0) {
            // Create default accounts
            this.tradingService.createAccount('spot').subscribe();
            this.tradingService.createAccount('margin').subscribe();
          }
        },
      });
  }

  loadMarketData(): void {
    const symbols = [this.symbol()];
    this.marketsService
      .getMarketData(symbols)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data.length > 0) {
            const data = response.data[0];
            this.currentPrice.set(data.last_price);
            this.priceChange24h.set(data.price_change_percent);
          }
        },
      });
  }

  startPriceUpdates(): void {
    interval(5000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.marketsService.getMarketData([this.symbol()]))
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data.length > 0) {
            this.currentPrice.set(response.data[0].last_price);
            this.priceChange24h.set(response.data[0].price_change_percent);
          }
        },
      });
  }

  selectTab(tab: 'spot' | 'margin'): void {
    this.selectedTab.set(tab);
  }

  refreshData(): void {
    this.loadMarketData();
    this.tradingService.getSpotOrders().subscribe();
    this.tradingService.getPositions().subscribe();
    this.tradingService.getTradeHistory(this.selectedTab()).subscribe();
  }
}
