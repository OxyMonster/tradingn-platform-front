import { CryptoPair } from './../../../../../core/models/market.model';
import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarketsService } from '../../../../../core/services/market.service';
import { MarketsTableComponent } from '../../../trading/components/markets/markets-table/markets-table';
import { Subject, takeUntil } from 'rxjs';
import { TradingviewTickerComponent } from '../trading-view-ticker/trading-view-ticker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MarketsTableComponent, TradingviewTickerComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {
  private destroy$ = new Subject<void>();

  topPairs = signal<CryptoPair[]>([]);
  topFiveCoinPrices = signal<CryptoPair[]>([]);
  isLoading = signal<boolean>(true);

  constructor(private marketsService: MarketsService) {}

  ngOnInit(): void {
    this.loadTopMarkets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getPriceClass(value: string): string {
    // Remove % and + symbols, then parse
    const num = parseFloat(value.replace(/[+,%]/g, ''));

    if (isNaN(num)) return 'text-gray'; // fallback
    if (num > 0) return 'text-green';
    if (num < 0) return 'text-red';
    return 'text-gray';
  }

  loadTopMarkets(): void {
    this.isLoading.set(true);

    this.marketsService
      .getCryptoPairs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Get top 10 pairs by volume
          const allPairs = this.marketsService.allPairs();

          const top10 = allPairs
            .sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0))
            .slice(0, 10);

          this.topPairs.set(top10);
          this.isLoading.set(false);

          // Fetch live prices
          this.fetchLivePrices(top10);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  fetchLivePrices(pairs: CryptoPair[]): void {
    const symbols = pairs.map((p) => p.symbol);

    this.marketsService
      .getMarketDataInBatches(symbols)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.marketsService.updatePairsWithMarketData(data);

          // Update local top pairs
          const updated = this.marketsService
            .allPairs()
            .filter((p) => symbols.includes(p.symbol))
            .sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0));

          //  set top five coin prices
          this.topPairs.set(updated);
          const topFiveCoinsPrice = updated
            .sort((a, b) => (b.volume_24h || 0) - (a.volume_24h || 0))
            .slice(0, 6);
          this.topFiveCoinPrices.set(topFiveCoinsPrice);
        },
      });
  }
}
