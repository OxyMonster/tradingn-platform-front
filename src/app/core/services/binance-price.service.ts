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

    return this.http
      .get<any>(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
      .pipe(
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
   * Get the current stored price for a symbol
   */
  getCurrentPrice(pair: string): number | null {
    const priceData = this.pricesSubject.value.get(pair);
    return priceData ? priceData.price : null;
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
    interval(2000)
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
