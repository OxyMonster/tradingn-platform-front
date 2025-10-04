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
  isLoading = signal<boolean>(true);
  topCoinsData: CryptoPair[] = [];

  constructor(private marketsService: MarketsService) {}

  ngOnInit(): void {
    this.loadTopMarkets();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTopMarkets(): void {
    this.isLoading.set(true);

    this.marketsService
      .getCryptoPairs()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Get top 10 pairs by volume
          this.topCoinsData = [];
          const allPairs = this.marketsService.allPairs();
          allPairs.map((pair) => {
            if (
              pair.base_asset === 'BTC' ||
              pair.base_asset === 'ETH' ||
              pair.base_asset === 'BNB' ||
              pair.base_asset === 'SOL' ||
              pair.base_asset === 'SOL' ||
              pair.base_asset === 'LTC' ||
              pair.base_asset === 'TRX'
            ) {
              this.topCoinsData.push(pair);
            }
          });

          console.log(this.topCoinsData);

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

          this.topPairs.set(updated);
        },
      });
  }
}
