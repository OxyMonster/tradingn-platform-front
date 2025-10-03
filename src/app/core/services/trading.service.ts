// core/services/trading.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  TradingAccount,
  Balance,
  Order,
  Trade,
  Position,
  OrderBookEntry,
  Candle,
} from '../models/trading.model';

@Injectable({
  providedIn: 'root',
})
export class TradingService {
  private readonly API_URL = 'http://localhost:8000/api/trading';

  // State
  spotAccount = signal<TradingAccount | null>(null);
  marginAccount = signal<TradingAccount | null>(null);
  openOrders = signal<Order[]>([]);
  openPositions = signal<Position[]>([]);
  recentTrades = signal<Trade[]>([]);

  constructor(private http: HttpClient) {}

  // Account Management
  getAccounts(): Observable<{ success: boolean; accounts: TradingAccount[] }> {
    return this.http
      .get<{ success: boolean; accounts: TradingAccount[] }>(`${this.API_URL}/accounts/`)
      .pipe(
        tap((response) => {
          if (response.success) {
            const spot = response.accounts.find((a) => a.account_type === 'spot');
            const margin = response.accounts.find((a) => a.account_type === 'margin');
            if (spot) this.spotAccount.set(spot);
            if (margin) this.marginAccount.set(margin);
          }
        })
      );
  }

  createAccount(accountType: 'spot' | 'margin'): Observable<any> {
    return this.http.post(`${this.API_URL}/accounts/`, { account_type: accountType });
  }

  getBalances(
    accountType: 'spot' | 'margin'
  ): Observable<{ success: boolean; balances: Balance[] }> {
    return this.http.get<{ success: boolean; balances: Balance[] }>(`${this.API_URL}/balances/`, {
      params: { account_type: accountType },
    });
  }

  deposit(accountType: 'spot' | 'margin', asset: string, amount: number): Observable<any> {
    return this.http.post(`${this.API_URL}/deposit/`, { account_type: accountType, asset, amount });
  }

  // Spot Trading
  placeSpotOrder(data: {
    symbol: string;
    side: 'buy' | 'sell';
    order_type: 'market' | 'limit';
    quantity: number;
    price?: number;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/spot/orders/`, data);
  }

  getSpotOrders(): Observable<{ success: boolean; orders: Order[] }> {
    return this.http
      .get<{ success: boolean; orders: Order[] }>(`${this.API_URL}/spot/orders/`)
      .pipe(
        tap((response) => {
          if (response.success) {
            this.openOrders.set(
              response.orders.filter((o) => o.status === 'open' || o.status === 'pending')
            );
          }
        })
      );
  }

  // Margin Trading
  openPosition(data: {
    symbol: string;
    side: 'buy' | 'sell';
    quantity: number;
    leverage: number;
    stop_loss?: number;
    take_profit?: number;
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/margin/positions/`, data);
  }

  getPositions(): Observable<{ success: boolean; positions: Position[] }> {
    return this.http
      .get<{ success: boolean; positions: Position[] }>(`${this.API_URL}/margin/positions/`)
      .pipe(
        tap((response) => {
          if (response.success) {
            this.openPositions.set(response.positions.filter((p) => p.is_open));
          }
        })
      );
  }

  closePosition(positionId: number, closePrice?: number): Observable<any> {
    return this.http.post(`${this.API_URL}/margin/close/`, {
      position_id: positionId,
      close_price: closePrice,
    });
  }

  // Trade History
  getTradeHistory(accountType: 'spot' | 'margin'): Observable<Trade[]> {
    return this.http
      .get<Trade[]>(`${this.API_URL}/trades/`, {
        params: { account_type: accountType },
      })
      .pipe(tap((trades) => this.recentTrades.set(trades)));
  }

  // Calculators
  calculateLiquidation(data: {
    entry_price: number;
    leverage: number;
    side: 'long' | 'short';
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/calculator/`, { type: 'liquidation', ...data });
  }

  calculatePnL(data: {
    entry_price: number;
    exit_price: number;
    quantity: number;
    leverage: number;
    side: 'long' | 'short';
  }): Observable<any> {
    return this.http.post(`${this.API_URL}/calculator/`, { type: 'pnl', ...data });
  }

  // Mock Order Book (replace with WebSocket in production)
  generateMockOrderBook(currentPrice: number): { bids: OrderBookEntry[]; asks: OrderBookEntry[] } {
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];

    // Generate 20 bid levels
    for (let i = 0; i < 20; i++) {
      const price = currentPrice * (1 - i * 0.001);
      const quantity = Math.random() * 5;
      bids.push({
        price: parseFloat(price.toFixed(2)),
        quantity: parseFloat(quantity.toFixed(4)),
        total: parseFloat((price * quantity).toFixed(2)),
      });
    }

    // Generate 20 ask levels
    for (let i = 0; i < 20; i++) {
      const price = currentPrice * (1 + i * 0.001);
      const quantity = Math.random() * 5;
      asks.push({
        price: parseFloat(price.toFixed(2)),
        quantity: parseFloat(quantity.toFixed(4)),
        total: parseFloat((price * quantity).toFixed(2)),
      });
    }

    return { bids, asks };
  }

  // Mock Recent Trades
  generateMockTrades(currentPrice: number, count: number = 20): Trade[] {
    const trades: Trade[] = [];
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      const variation = (Math.random() - 0.5) * 0.02;
      const price = currentPrice * (1 + variation);
      const quantity = Math.random() * 2;
      const side = Math.random() > 0.5 ? 'buy' : 'sell';

      trades.push({
        id: i,
        order: i,
        symbol: 'BTCUSDT',
        side: side as 'buy' | 'sell',
        quantity: parseFloat(quantity.toFixed(4)),
        price: parseFloat(price.toFixed(2)),
        total: parseFloat((price * quantity).toFixed(2)),
        fee: parseFloat((price * quantity * 0.001).toFixed(2)),
        fee_asset: 'USDT',
        executed_at: new Date(now - i * 5000).toISOString(),
      });
    }

    return trades;
  }
}
