// src/app/core/services/trading.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environment.development';
import {
  ApiResponse,
  SpotOrderRequest,
  SpotOrder,
  MarginPositionRequest,
  MarginPosition,
  Portfolio,
  Trade,
  OrderBook,
  OrderBookEntry,
} from '../models/trading.model';

@Injectable({
  providedIn: 'root',
})
export class TradingService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==================== ACCOUNTS & BALANCE ====================

  /**
   * Get or create trading accounts
   */
  getTradingAccounts(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/trading/accounts/`).pipe(
      catchError((err) => {
        console.error('Get accounts error:', err);
        return of({ success: false, error: 'Failed to get accounts' });
      })
    );
  }

  /**
   * Create a trading account
   */
  createTradingAccount(accountType: 'spot' | 'margin'): Observable<ApiResponse<any>> {
    return this.http
      .post<ApiResponse<any>>(`${this.apiUrl}/trading/accounts/`, {
        account_type: accountType,
      })
      .pipe(
        catchError((err) => {
          console.error('Create account error:', err);
          return of({ success: false, error: 'Failed to create account' });
        })
      );
  }

  /**
   * Get balances for an account
   */
  getBalance(accountType: 'spot' | 'margin' = 'spot'): Observable<ApiResponse<any>> {
    return this.http
      .get<ApiResponse<any>>(`${this.apiUrl}/trading/balances/?account_type=${accountType}`)
      .pipe(
        catchError((err) => {
          console.error('Get balance error:', err);
          return of({ success: true, balances: [] });
        })
      );
  }

  /**
   * Deposit funds (demo)
   */
  deposit(accountType: string, asset: string, amount: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/trading/deposit/`, {
      account_type: accountType,
      asset: asset,
      amount: amount,
    });
  }

  // ==================== BINANCE REAL DATA (via Django proxy) ====================

  /**
   * Get 24hr ticker statistics from Binance (via Django)
   */
  getBinance24hrStats(symbol: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/trading/binance/ticker/${symbol}/`).pipe(
      catchError((err) => {
        console.error('Binance 24hr stats error:', err);
        return of(null);
      })
    );
  }

  /**
   * Get real-time market price from Binance (via Django)
   */
  getBinancePrice(symbol: string): Observable<number> {
    return this.getBinance24hrStats(symbol).pipe(
      map((response) => (response ? parseFloat(response.lastPrice) : 0))
    );
  }

  /**
   * Get order book from Binance (via Django)
   */
  getBinanceOrderBook(symbol: string, limit: number = 20): Observable<OrderBook> {
    return this.http.get<any>(`${this.apiUrl}/markets/orderbook/${symbol}/?limit=${limit}`).pipe(
      map((response) => {
        const bids: OrderBookEntry[] = response.bids.map((b: string[]) => ({
          price: parseFloat(b[0]),
          quantity: parseFloat(b[1]),
          total: parseFloat(b[0]) * parseFloat(b[1]),
        }));

        const asks: OrderBookEntry[] = response.asks.map((a: string[]) => ({
          price: parseFloat(a[0]),
          quantity: parseFloat(a[1]),
          total: parseFloat(a[0]) * parseFloat(a[1]),
        }));

        return { bids, asks };
      }),
      catchError((err) => {
        console.error('Binance order book error:', err);
        return of({ bids: [], asks: [] });
      })
    );
  }

  /**
   * Get recent trades from Binance (via Django)
   */
  getBinanceRecentTrades(symbol: string, limit: number = 50): Observable<any[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}/trading/binance/trades/${symbol}/?limit=${limit}`)
      .pipe(
        catchError((err) => {
          console.error('Binance trades error:', err);
          return of([]);
        })
      );
  }

  // ==================== MARKET PRICE ====================

  /**
   * Get market price (alternative endpoint)
   */
  getMarketPrice(symbol: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/trading/market-price/${symbol}/`).pipe(
      catchError((err) => {
        console.error('Get market price error:', err);
        return of({ success: false, error: 'Failed to get price' });
      })
    );
  }
}
