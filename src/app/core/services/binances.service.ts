// src/app/core/services/binance.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, shareReplay, switchMap, startWith, catchError } from 'rxjs/operators';

export interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

export interface BinanceOrderBookEntry {
  price: string;
  quantity: string;
}

export interface BinanceOrderBook {
  bids: BinanceOrderBookEntry[];
  asks: BinanceOrderBookEntry[];
}

export interface BinanceTrade {
  id: number;
  price: string;
  qty: string;
  time: number;
  isBuyerMaker: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BinanceService {
  private readonly BINANCE_API = 'https://api.binance.com/api/v3';
  private priceCache = new Map<string, Observable<BinanceTicker>>();

  constructor(private http: HttpClient) {}

  /**
   * Get 24hr ticker data for a symbol with auto-refresh
   */
  getTicker(symbol: string): Observable<BinanceTicker> {
    if (!this.priceCache.has(symbol)) {
      const ticker$ = interval(2000).pipe(
        startWith(0),
        switchMap(() => this.fetchTicker(symbol)),
        shareReplay(1)
      );
      this.priceCache.set(symbol, ticker$);
    }
    return this.priceCache.get(symbol)!;
  }

  /**
   * Fetch ticker once
   */
  private fetchTicker(symbol: string): Observable<BinanceTicker> {
    return this.http.get<BinanceTicker>(`${this.BINANCE_API}/ticker/24hr?symbol=${symbol}`).pipe(
      catchError((err) => {
        console.error('Binance API error:', err);
        // Return mock data on error
        return [
          {
            symbol: symbol,
            lastPrice: '43250.50',
            priceChange: '1250.30',
            priceChangePercent: '2.98',
            highPrice: '43500.00',
            lowPrice: '41800.00',
            volume: '25678.45',
            quoteVolume: '1100000000',
          },
        ];
      })
    );
  }

  /**
   * Get order book depth
   */
  getOrderBook(symbol: string, limit: number = 20): Observable<BinanceOrderBook> {
    return this.http.get<any>(`${this.BINANCE_API}/depth?symbol=${symbol}&limit=${limit}`).pipe(
      map((response) => ({
        bids: response.bids.map((b: string[]) => ({
          price: b[0],
          quantity: b[1],
        })),
        asks: response.asks.map((a: string[]) => ({
          price: a[0],
          quantity: a[1],
        })),
      })),
      catchError((err) => {
        console.error('Order book error:', err);
        return [{ bids: [], asks: [] }];
      })
    );
  }

  /**
   * Get recent trades
   */
  getRecentTrades(symbol: string, limit: number = 50): Observable<BinanceTrade[]> {
    return this.http
      .get<BinanceTrade[]>(`${this.BINANCE_API}/trades?symbol=${symbol}&limit=${limit}`)
      .pipe(
        catchError((err) => {
          console.error('Recent trades error:', err);
          return [[]];
        })
      );
  }

  /**
   * Get current price only
   */
  getCurrentPrice(symbol: string): Observable<number> {
    return this.http
      .get<{ price: string }>(`${this.BINANCE_API}/ticker/price?symbol=${symbol}`)
      .pipe(
        map((response) => parseFloat(response.price)),
        catchError((err) => {
          console.error('Price fetch error:', err);
          return [43250.5];
        })
      );
  }
}
