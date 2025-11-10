// core/services/markets.service.ts
import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { tap, catchError, map, delay } from 'rxjs/operators';
import { CryptoPair, MarketData } from '../../../../../../core/models/market.model';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../../../../environment.development';
import { BinancePriceService } from '../../../../../../core/services/binance-price.service';

@Injectable({
  providedIn: 'root',
})
export class MarketsService {
  private readonly API_URL = `${environment.apiUrl}/api/markets`;
  private readonly BATCH_SIZE = 100; // Binance supports up to 100 symbols per request

  allPairs = signal<CryptoPair[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private binancePriceService = inject(BinancePriceService);

  constructor(private http: HttpClient) {}

  getMarketData(symbols: string[]): Observable<{ success: boolean; data: MarketData[] }> {
    let params = new HttpParams();

    if (symbols && symbols.length > 0) {
      params = params.set('symbols', symbols.join(','));
    }

    return this.http.get<{ success: boolean; data: MarketData[] }>(`${this.API_URL}/data/`, {
      params,
    });
  }

  getCryptoPairs(): Observable<CryptoPair[]> {
    this.isLoading.set(true);

    return this.http.get<CryptoPair[]>(`${this.API_URL}/pairs/`).pipe(
      tap((pairs) => {
        console.log('Loaded pairs:', pairs.length);
        this.allPairs.set(pairs);
        this.isLoading.set(false);
        this.error.set(null);
      }),
      catchError((error) => {
        this.isLoading.set(false);
        this.error.set('Failed to load crypto pairs');
        console.error('API Error:', error);
        return of([]);
      })
    );
  }

  /**
   * Fetch market data in batches directly from Binance API
   */
  getMarketDataInBatches(symbols: string[]): Observable<MarketData[]> {
    if (symbols.length === 0) return of([]);

    console.log(`Fetching ${symbols.length} symbols from Binance API in batches of ${this.BATCH_SIZE}`);

    // Split into batches (Binance supports up to 100 symbols per request)
    const batches: string[][] = [];
    for (let i = 0; i < symbols.length; i += this.BATCH_SIZE) {
      batches.push(symbols.slice(i, i + this.BATCH_SIZE));
    }

    // Create observables for each batch
    const batchRequests = batches.map((batch, index) => {
      return this.binancePriceService.fetch24hrTickerData(batch).pipe(
        map((binanceData) => this.transformBinanceDataToMarketData(binanceData)),
        catchError((error) => {
          console.error(`Batch ${index + 1} failed:`, error);
          return of([]);
        })
      );
    });

    // Execute all batches in parallel
    return (batches.length === 1 ? batchRequests[0] : forkJoin(batchRequests).pipe(
      map((results) => results.flat())
    )).pipe(
      tap((data) => console.log(`Received ${data.length} market data items from Binance`))
    );
  }

  /**
   * Transform Binance 24hr ticker data to MarketData format
   */
  private transformBinanceDataToMarketData(binanceData: any[]): MarketData[] {
    return binanceData.map((item) => ({
      symbol: item.symbol,
      last_price: parseFloat(item.lastPrice),
      price_change: parseFloat(item.priceChange),
      price_change_percent: parseFloat(item.priceChangePercent),
      high_24h: parseFloat(item.highPrice),
      low_24h: parseFloat(item.lowPrice),
      volume_24h: parseFloat(item.volume),
      quote_volume_24h: parseFloat(item.quoteVolume),
    }));
  }

  updatePairsWithMarketData(marketData: MarketData[]): void {
    if (!marketData || marketData.length === 0) return;

    const currentPairs = this.allPairs();
    if (!Array.isArray(currentPairs)) return;

    const marketDataMap = new Map(marketData.map((data) => [data.symbol, data]));

    const updatedPairs = currentPairs.map((pair) => {
      const data = marketDataMap.get(pair.symbol);
      if (data) {
        return {
          ...pair,
          last_price: data.last_price,
          price_change_24h: data.price_change,
          price_change_percent: data.price_change_percent,
          high_24h: data.high_24h,
          low_24h: data.low_24h,
          volume_24h: data.volume_24h,
          formatted_price: this.formatPrice(data.last_price),
          formatted_high: this.formatPrice(data.high_24h),
          formatted_low: this.formatPrice(data.low_24h),
          formatted_volume: this.formatVolume(data.quote_volume_24h, pair.quote_asset),
          price_change_display: this.formatPriceChange(data.price_change_percent),
        };
      }
      return pair;
    });

    this.allPairs.set(updatedPairs);
  }

  private formatPrice(price: number): string {
    if (!price) return '$0.00';

    if (price >= 1000) {
      return `$${price.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    } else if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.0001) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toFixed(8)}`;
    }
  }

  private formatVolume(volume: number, quoteAsset: string): string {
    if (!volume) return `0.00 (${quoteAsset})`;

    const formatted = volume.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${formatted} (${quoteAsset})`;
  }

  private formatPriceChange(change: number): string {
    if (!change) return '0.00%';

    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  }
}
