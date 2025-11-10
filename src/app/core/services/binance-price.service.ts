import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, Subject } from 'rxjs';
import { takeUntil, catchError, tap } from 'rxjs/operators';

export interface BinancePrice {
  symbol: string;
  price: number;
  lastUpdate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class BinancePriceService {
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  // Store current prices for multiple symbols
  private pricesSubject = new BehaviorSubject<Map<string, BinancePrice>>(new Map());
  public prices$ = this.pricesSubject.asObservable();

  // Store active subscriptions by symbol
  private activeSubscriptions = new Map<string, Subject<void>>();

  constructor() {}

  /**
   * Convert pair format from "BTC/USDT" to "BTCUSDT" for Binance API
   */
  private formatSymbolForBinance(pair: string): string {
    return pair.replace('/', '').toUpperCase();
  }

  /**
   * Fetch current price for a symbol from Binance API
   */
  fetchPrice(pair: string): Observable<number> {
    const symbol = this.formatSymbolForBinance(pair);

    return this.http.get<any>(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`).pipe(
      tap((data) => {
        const price = parseFloat(data.price);
        const priceData: BinancePrice = {
          symbol: pair,
          price: price,
          lastUpdate: new Date(),
        };

        // Update prices map
        const prices = this.pricesSubject.value;
        prices.set(pair, priceData);
        this.pricesSubject.next(prices);
      }),
      catchError((error) => {
        console.error(`Error fetching price for ${pair}:`, error);
        throw error;
      })
    );
  }

  /**
   * Fetch 24hr ticker data for multiple symbols from Binance API
   * Returns comprehensive market data including price, volume, changes, etc.
   */
  fetch24hrTickerData(pairs: string[]): Observable<any[]> {
    if (pairs.length === 0) return new Observable(subscriber => { subscriber.next([]); subscriber.complete(); });

    const symbols = pairs.map((pair) => this.formatSymbolForBinance(pair));
    const symbolsParam = JSON.stringify(symbols);

    return this.http
      .get<any[]>(`https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbolsParam)}`)
      .pipe(
        tap((data) => {
          console.log(`Fetched 24hr ticker data for ${data.length} symbols from Binance`);
        }),
        catchError((error) => {
          console.error(`Error fetching 24hr ticker data:`, error);
          throw error;
        })
      );
  }

  /**
   * Get the current stored price for a symbol
   */
  getCurrentPrice(pair: string): number | null {
    const priceData = this.pricesSubject.value.get(pair);
    return priceData ? priceData.price : null;
  }

  /**
   * Subscribe to real-time price updates for multiple symbols
   * Polls Binance API every 3 seconds with a single request for all pairs
   */
  subscribeToMultiplePrices(pairs: string[], callback: (pair: string, price: number) => void): void {
    // Unsubscribe from any existing multi-pair subscription
    if (this.activeSubscriptions.has('__multi__')) {
      this.unsubscribeFromPrice('__multi__');
    }

    const destroy$ = new Subject<void>();
    this.activeSubscriptions.set('__multi__', destroy$);

    const symbols = pairs.map((pair) => this.formatSymbolForBinance(pair));

    // Create symbols parameter as JSON array for Binance API
    const symbolsParam = JSON.stringify(symbols);

    // Fetch immediately
    this.http
      .get<any[]>(`https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(symbolsParam)}`)
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (data) => {
          this.processBatchPriceData(data, pairs, callback);
        },
        error: (error) => {
          console.error(`Error fetching initial prices for multiple pairs:`, error);
        },
      });

    // Poll for updates every 3 seconds
    interval(3000)
      .pipe(takeUntil(destroy$))
      .subscribe(() => {
        this.http
          .get<any[]>(`https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(symbolsParam)}`)
          .pipe(takeUntil(destroy$))
          .subscribe({
            next: (data) => {
              this.processBatchPriceData(data, pairs, callback);
            },
            error: (error) => {
              // Silently ignore AbortErrors
              if (
                error.status === 0 ||
                error.name === 'AbortError' ||
                error.error?.name === 'AbortError'
              ) {
                return;
              }
              console.error(`Error fetching prices for multiple pairs:`, error);
            },
          });
      });
  }

  /**
   * Process batch price data from Binance API
   */
  private processBatchPriceData(data: any[], pairs: string[], callback: (pair: string, price: number) => void): void {
    // Create a map of formatted symbols to original pairs
    const symbolToPairMap = new Map<string, string>();
    pairs.forEach((pair) => {
      const symbol = this.formatSymbolForBinance(pair);
      symbolToPairMap.set(symbol, pair);
    });

    // Process each price from the response
    data.forEach((item) => {
      const pair = symbolToPairMap.get(item.symbol);
      if (pair) {
        const price = parseFloat(item.price);
        const priceData: BinancePrice = {
          symbol: pair,
          price: price,
          lastUpdate: new Date(),
        };

        // Update prices map
        const prices = this.pricesSubject.value;
        prices.set(pair, priceData);
        this.pricesSubject.next(prices);

        callback(pair, price);
      }
    });
  }

  /**
   * Subscribe to real-time price updates for a symbol
   * Polls Binance API every 2 seconds
   */
  subscribeToPrice(pair: string, callback: (price: number) => void): void {
    // If already subscribed, unsubscribe first
    if (this.activeSubscriptions.has(pair)) {
      this.unsubscribeFromPrice(pair);
    }

    const destroy$ = new Subject<void>();
    this.activeSubscriptions.set(pair, destroy$);

    const symbol = this.formatSymbolForBinance(pair);

    // Fetch immediately
    this.http
      .get<any>(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
      .pipe(takeUntil(destroy$))
      .subscribe({
        next: (data) => {
          const price = parseFloat(data.price);
          const priceData: BinancePrice = {
            symbol: pair,
            price: price,
            lastUpdate: new Date(),
          };

          // Update prices map
          const prices = this.pricesSubject.value;
          prices.set(pair, priceData);
          this.pricesSubject.next(prices);

          callback(price);
        },
        error: (error) => {
          console.error(`Error fetching initial price for ${pair}:`, error);
        },
      });

    // Poll for updates every 2 seconds
    interval(3000)
      .pipe(takeUntil(destroy$))
      .subscribe(() => {
        this.http
          .get<any>(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
          .pipe(takeUntil(destroy$))
          .subscribe({
            next: (data) => {
              const price = parseFloat(data.price);
              const priceData: BinancePrice = {
                symbol: pair,
                price: price,
                lastUpdate: new Date(),
              };

              // Update prices map
              const prices = this.pricesSubject.value;
              prices.set(pair, priceData);
              this.pricesSubject.next(prices);

              callback(price);
            },
            error: (error) => {
              // Silently ignore AbortErrors
              if (
                error.status === 0 ||
                error.name === 'AbortError' ||
                error.error?.name === 'AbortError'
              ) {
                return;
              }
              console.error(`Error fetching price for ${pair}:`, error);
            },
          });
      });
  }

  /**
   * Unsubscribe from price updates for a symbol
   */
  unsubscribeFromPrice(pair: string): void {
    const destroy$ = this.activeSubscriptions.get(pair);
    if (destroy$) {
      destroy$.next();
      destroy$.complete();
      this.activeSubscriptions.delete(pair);
    }
  }

  /**
   * Unsubscribe from all price updates
   */
  unsubscribeAll(): void {
    this.activeSubscriptions.forEach((destroy$) => {
      destroy$.next();
      destroy$.complete();
    });
    this.activeSubscriptions.clear();
  }

  /**
   * Clean up on service destroy
   */
  ngOnDestroy(): void {
    this.unsubscribeAll();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
