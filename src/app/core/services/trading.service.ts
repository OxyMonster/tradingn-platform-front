// src/app/core/services/trading.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environment.development';
import {
  ApiResponse,
  MarketPrice,
  SpotOrderRequest,
  SpotOrder,
  MarginPositionRequest,
  MarginPosition,
  Portfolio,
  Trade,
  Wallet,
  Transaction,
  OrderBook,
  OrderBookEntry,
} from '../models/trading.model';

@Injectable({
  providedIn: 'root',
})
export class TradingService {
  private apiUrl = environment.apiUrl || 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // ==================== MARKET DATA ====================

  /**
   * Get current market price for a symbol
   * Note: This endpoint doesn't exist in your Django yet, will use mock data
   */
  getMarketPrice(symbol: string): Observable<ApiResponse<MarketPrice>> {
    // Your Django doesn't have this endpoint yet, so return mock data
    return of({
      success: true,
      data: {
        symbol: symbol,
        price: 43250.5,
        price_change_24h: 1250.3,
        price_change_percent_24h: 2.98,
        high_24h: 43500.0,
        low_24h: 41800.0,
        volume_24h: 25678.45,
        timestamp: new Date().toISOString(),
      },
    });

    // Uncomment this when you add the endpoint to Django:
    // return this.http.get<ApiResponse<MarketPrice>>(
    //   `${this.apiUrl}/trading/market-price/${symbol}/`
    // );
  }

  /**
   * Get multiple symbols prices
   */
  getMultipleMarketPrices(symbols: string[]): Observable<ApiResponse<MarketPrice[]>> {
    return this.http.post<ApiResponse<MarketPrice[]>>(`${this.apiUrl}/trading/market-prices/`, {
      symbols,
    });
  }

  // ==================== SPOT TRADING ====================

  /**
   * Place a spot order (market or limit)
   * Updated to match your Django URL: api/trading/spot/orders/
   */
  placeSpotOrder(order: SpotOrderRequest): Observable<ApiResponse<SpotOrder>> {
    return this.http.post<ApiResponse<SpotOrder>>(`${this.apiUrl}/trading/spot/orders/`, order);
  }

  /**
   * Get all spot orders for the current user
   * Updated to match your Django URL: api/trading/spot/orders/
   */
  getSpotOrders(status?: string): Observable<ApiResponse<SpotOrder[]>> {
    let url = `${this.apiUrl}/trading/spot/orders/`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<ApiResponse<SpotOrder[]>>(url);
  }

  /**
   * Get a specific spot order
   */
  getSpotOrder(orderId: number): Observable<ApiResponse<SpotOrder>> {
    return this.http.get<ApiResponse<SpotOrder>>(`${this.apiUrl}/trading/spot/orders/${orderId}/`);
  }

  /**
   * Cancel a spot order
   */
  cancelSpotOrder(orderId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/trading/spot/orders/${orderId}/cancel/`, {});
  }

  // ==================== MARGIN TRADING ====================

  /**
   * Open a margin position
   * Updated to match your Django URL: api/trading/margin/positions/
   */
  openPosition(position: MarginPositionRequest): Observable<ApiResponse<MarginPosition>> {
    return this.http.post<ApiResponse<MarginPosition>>(
      `${this.apiUrl}/trading/margin/positions/`,
      position
    );
  }

  /**
   * Get all margin positions
   * Updated to match your Django URL: api/trading/margin/positions/
   */
  getPositions(status?: string): Observable<ApiResponse<MarginPosition[]>> {
    let url = `${this.apiUrl}/trading/margin/positions/`;
    if (status) {
      url += `?status=${status}`;
    }
    return this.http.get<ApiResponse<MarginPosition[]>>(url);
  }

  /**
   * Get a specific margin position
   */
  getPosition(positionId: number): Observable<ApiResponse<MarginPosition>> {
    return this.http.get<ApiResponse<MarginPosition>>(
      `${this.apiUrl}/trading/margin/positions/${positionId}/`
    );
  }

  /**
   * Close a margin position
   * Updated to match your Django URL: api/trading/margin/close/
   */
  closePosition(positionId: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/trading/margin/close/`, {
      position_id: positionId,
    });
  }

  /**
   * Update stop loss / take profit
   */
  updatePosition(
    positionId: number,
    updates: { stop_loss?: number; take_profit?: number }
  ): Observable<ApiResponse<MarginPosition>> {
    return this.http.patch<ApiResponse<MarginPosition>>(
      `${this.apiUrl}/trading/margin-positions/${positionId}/`,
      updates
    );
  }

  // ==================== PORTFOLIO ====================

  /**
   * Get user portfolio summary
   */
  getPortfolio(): Observable<ApiResponse<Portfolio>> {
    return this.http.get<ApiResponse<Portfolio>>(`${this.apiUrl}/trading/portfolio/`);
  }

  // ==================== WALLET ====================

  /**
   * Get user wallets
   */
  getWallets(): Observable<ApiResponse<Wallet[]>> {
    return this.http.get<ApiResponse<Wallet[]>>(`${this.apiUrl}/trading/wallets/`);
  }

  /**
   * Get specific wallet
   */
  getWallet(currency: string): Observable<ApiResponse<Wallet>> {
    return this.http.get<ApiResponse<Wallet>>(`${this.apiUrl}/trading/wallets/${currency}/`);
  }

  /**
   * Get wallet transactions
   */
  getTransactions(walletId: number): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(
      `${this.apiUrl}/trading/wallets/${walletId}/transactions/`
    );
  }

  // ==================== TRADE HISTORY ====================

  /**
   * Get trade history
   */
  getTradeHistory(symbol?: string): Observable<ApiResponse<Trade[]>> {
    let url = `${this.apiUrl}/trading/trades/`;
    if (symbol) {
      url += `?symbol=${symbol}`;
    }
    return this.http.get<ApiResponse<Trade[]>>(url);
  }

  // ==================== MOCK DATA GENERATORS ====================

  /**
   * Generate mock order book data for testing
   */
  generateMockOrderBook(currentPrice: number): OrderBook {
    const bids: OrderBookEntry[] = [];
    const asks: OrderBookEntry[] = [];

    // Generate 20 bid levels
    for (let i = 0; i < 20; i++) {
      const price = currentPrice - (i + 1) * (currentPrice * 0.0001);
      const quantity = Math.random() * 5 + 0.1;
      bids.push({
        price: price,
        quantity: quantity,
        total: price * quantity,
      });
    }

    // Generate 20 ask levels
    for (let i = 0; i < 20; i++) {
      const price = currentPrice + (i + 1) * (currentPrice * 0.0001);
      const quantity = Math.random() * 5 + 0.1;
      asks.push({
        price: price,
        quantity: quantity,
        total: price * quantity,
      });
    }

    return { bids, asks };
  }

  /**
   * Calculate liquidation price for a position
   */
  calculateLiquidationPrice(
    entryPrice: number,
    leverage: number,
    side: 'buy' | 'sell',
    maintenanceMarginRate: number = 0.005
  ): number {
    if (side === 'buy') {
      // Long position liquidation
      return entryPrice * (1 - 1 / leverage + maintenanceMarginRate);
    } else {
      // Short position liquidation
      return entryPrice * (1 + 1 / leverage - maintenanceMarginRate);
    }
  }

  /**
   * Calculate required margin for a position
   */
  calculateRequiredMargin(price: number, quantity: number, leverage: number): number {
    const positionValue = price * quantity;
    return positionValue / leverage;
  }

  /**
   * Calculate PNL for a position
   */
  calculatePnL(
    entryPrice: number,
    currentPrice: number,
    quantity: number,
    side: 'buy' | 'sell'
  ): number {
    if (side === 'buy') {
      return (currentPrice - entryPrice) * quantity;
    } else {
      return (entryPrice - currentPrice) * quantity;
    }
  }

  /**
   * Calculate PNL percentage
   */
  calculatePnLPercent(entryPrice: number, currentPrice: number, side: 'buy' | 'sell'): number {
    if (side === 'buy') {
      return ((currentPrice - entryPrice) / entryPrice) * 100;
    } else {
      return ((entryPrice - currentPrice) / entryPrice) * 100;
    }
  }
}
