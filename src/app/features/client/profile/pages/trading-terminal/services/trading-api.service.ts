import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { TokenService } from '../../../../../../core/services/token.service';
import { environment } from '../../../../../../../environment.development';

export type OrderType = 'market' | 'limit' | 'stop_limit';
export type OrderSide = 'buy' | 'sell';
export type OrderStatus = 'open' | 'filled' | 'cancelled' | 'partially_filled';

export interface ApiOrder {
  _id?: string;
  id?: string;
  profit: number;
  currentPrice: number;
  entryPrice: number;
  pledge: number;
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price: number;
  triggerPrice?: number;
  quantity: number;
  filled: number;
  remaining: number;
  total: number;
  fee: number;
  status: OrderStatus;
  createdAt: Date | string;
  filledAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ApiBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
}

export interface BalancesResponse {
  balances: ApiBalance[];
}

export interface PlaceOrderRequest {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  triggerPrice?: number;
}

export interface PlaceOrderResponse {
  success: boolean;
  message: string;
  order?: ApiOrder;
}

export interface ApiTrade {
  _id: string;
  userId: string;
  orderId: string;
  symbol: string;
  side: OrderSide;
  price: number;
  quantity: number;
  fee: number;
  total: number;
  timestamp: Date | string;
}

@Injectable({
  providedIn: 'root',
})
export class TradingApiService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private readonly API_URL = `${environment.apiUrl}/api`;

  // Observables for real-time data (like DemoTradingService)
  private balancesSubject = new BehaviorSubject<Map<string, ApiBalance>>(new Map());
  public balances$ = this.balancesSubject.asObservable();

  private ordersSubject = new BehaviorSubject<ApiOrder[]>([]);
  public orders$ = this.ordersSubject.asObservable();

  private orderHistorySubject = new BehaviorSubject<ApiOrder[]>([]);
  public orderHistory$ = this.orderHistorySubject.asObservable();

  constructor() {
    // Initial data is loaded on-demand by components
  }

  /**
   * Get HTTP headers with authorization
   */
  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getAccessToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Get balance for specific asset
   */
  getBalance(asset: string): ApiBalance | undefined {
    return this.balancesSubject.value.get(asset);
  }

  /**
   * Place an order (buy/sell)
   */
  placeOrder(payload: any): Observable<PlaceOrderResponse> {
    return this.http
      .post<PlaceOrderResponse>(`${this.API_URL}/trading/orders/place`, payload, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            // Refresh balances and orders after successful order
            // this.loadBalances();
            // this.loadOpenOrders();
            // this.loadOrderHistory();
          }
        }),
        catchError((error) => {
          console.error('Error placing order:', error);
          return throwError(() => error);
        })
      );
  }
  /**
   * Place an order (buy/sell)
   */
  placeColosedOrder(payload: any): Observable<PlaceOrderResponse> {
    return this.http
      .post<PlaceOrderResponse>(`${this.API_URL}/trading/orders/placeClosed`, payload, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            // Refresh balances and orders after successful order
            // this.loadBalances();
            // this.loadOpenOrders();
            // this.loadOrderHistory();
          }
        }),
        catchError((error) => {
          console.error('Error placing order:', error);
          return throwError(() => error);
        })
      );
  }

  editOrder(payload: any) {
    return this.http.post(`${this.API_URL}/trading/orders/edit`, payload);
  }

  closeOrder(payload: any) {
    console.log(payload);

    return this.http.post(`${this.API_URL}/trading/orders/close`, payload);
  }

  openClosedOrder(payload: any) {
    return this.http.post(`${this.API_URL}/trading/orders/openClosedOrder`, payload);
  }

  deleteOrder(payload: any) {
    return this.http.post(`${this.API_URL}/trading/orders/delete`, { id: payload });
  }

  /**
   * Load open orders from backend
   */
  loadOpenOrders(clientId: any, workerid: any): Observable<any> {
    console.log(clientId, workerid);

    return this.http.get(`${this.API_URL}/trading/orders/open`, {
      headers: this.getHeaders(),
      params: { clientId, workerid },
    });
  }

  /**
   * Get open orders as Observable
   */
  getOpenOrders(): Observable<ApiOrder[]> {
    return this.http
      .get<ApiOrder[]>(`${this.API_URL}/trading/trading/orders/open`, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((orders) => {
          this.ordersSubject.next(orders);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Get specific order details
   */
  getOrder(orderId: string): Observable<ApiOrder> {
    return this.http
      .get<ApiOrder>(`${this.API_URL}/trading/orders/${orderId}`, {
        headers: this.getHeaders(),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get trade history
   */
  getTrades(params?: { symbol?: string; limit?: number; skip?: number }): Observable<ApiTrade[]> {
    let httpParams = new HttpParams();
    if (params?.symbol) httpParams = httpParams.set('symbol', params.symbol);
    if (params?.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params?.skip) httpParams = httpParams.set('skip', params.skip.toString());

    return this.http
      .get<ApiTrade[]>(`${this.API_URL}/trades`, {
        headers: this.getHeaders(),
        params: httpParams,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get trades for specific symbol
   */
  getTradesForSymbol(symbol: string, limit?: number): Observable<ApiTrade[]> {
    return this.getTrades({ symbol, limit });
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    // Ignore AbortError - it's expected when requests are cancelled
    // Check for status 0 (cancelled) or AbortError name
    if (error.status === 0 || error.name === 'AbortError' || error.error?.name === 'AbortError') {
      return throwError(() => error);
    }

    let errorMessage = 'An error occurred';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('API Error:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
