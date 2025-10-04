// trading-terminal.component.ts
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TradingService } from '../../../../core/services/trading.service';
import { ChartWidgetComponent } from './components/chart-widget/chart-widget';
import { OpenOrdersComponent } from './components/open-orders/open-orders';
import { OrderBookComponent } from './components/order-book/order-book';
import { PositionsTableComponent } from './components/positions-table/positions-table';
import { RecentTradesComponent } from './components/recent-trades/recent-trades';
import { TradeFormComponent } from './components/trade-form/trade-form';

// Import all child components

@Component({
  selector: 'app-trading-terminal',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonToggleModule,
    ChartWidgetComponent,
    OrderBookComponent,
    TradeFormComponent,
    OpenOrdersComponent,
    PositionsTableComponent,
    RecentTradesComponent,
  ],
  templateUrl: './trading-terminal.html',
  styleUrl: './trading-terminal.scss',
})
export class TradingTerminalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Trading state
  symbol = signal<string>('BTCUSDT');
  currentPrice = signal<number>(0);
  priceChange24h = signal<number>(0);
  priceChangePercent24h = signal<number>(0);
  high24h = signal<number>(0);
  low24h = signal<number>(0);
  volume24h = signal<number>(0);

  // UI state
  tradingMode = signal<'spot' | 'margin'>('spot');
  selectedTab = signal<number>(0);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  constructor(private route: ActivatedRoute, private tradingService: TradingService) {}

  ngOnInit(): void {
    // Get symbol from route params
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      if (params['symbol']) {
        this.symbol.set(params['symbol'].toUpperCase());
      }
      this.loadMarketData();
    });

    // Update price every 5 seconds (increased from 2 to reduce errors)
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadMarketData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadMarketData(): void {
    this.tradingService.getMarketPrice(this.symbol()).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.errorMessage.set('');

        if (response.success && response.data) {
          this.currentPrice.set(response.data.price);
          this.priceChange24h.set(response.data.price_change_24h || 0);
          this.priceChangePercent24h.set(response.data.price_change_percent_24h || 0);
          this.high24h.set(response.data.high_24h || 0);
          this.low24h.set(response.data.low_24h || 0);
          this.volume24h.set(response.data.volume_24h || 0);
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Failed to load market data:', error);

        // Set error message
        if (error.error && typeof error.error === 'string') {
          this.errorMessage.set(error.error);
        } else if (error.status === 0) {
          this.errorMessage.set(
            'Cannot connect to backend. Please ensure Django server is running on http://localhost:8000'
          );
        } else {
          this.errorMessage.set('Failed to load market data. Please try again.');
        }

        // Use mock data if backend is not available
        if (!this.currentPrice()) {
          this.useMockData();
        }
      },
    });
  }

  private useMockData(): void {
    // Use mock data when backend is unavailable
    this.currentPrice.set(43250.5);
    this.priceChange24h.set(1250.3);
    this.priceChangePercent24h.set(2.98);
    this.high24h.set(43500.0);
    this.low24h.set(41800.0);
    this.volume24h.set(25678.45);
  }

  switchTradingMode(mode: 'spot' | 'margin'): void {
    this.tradingMode.set(mode);
  }

  get isPriceUp(): boolean {
    return this.priceChange24h() >= 0;
  }
}
