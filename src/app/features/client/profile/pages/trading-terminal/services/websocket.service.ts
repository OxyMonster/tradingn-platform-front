import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface TickerData {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdate: Date;
}

export interface OrderBookData {
  bids: [number, number][]; // [price, quantity]
  asks: [number, number][];
  lastUpdate: Date;
}

export interface TradeData {
  id: string;
  price: number;
  quantity: number;
  time: Date;
  isBuyerMaker: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private platformId = inject(PLATFORM_ID);
  private http = inject(HttpClient);
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();

  // Observables for real-time data
  private tickerSubject = new BehaviorSubject<TickerData | null>(null);
  private orderBookSubject = new BehaviorSubject<OrderBookData | null>(null);
  private tradesSubject = new Subject<TradeData>();
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  public ticker$ = this.tickerSubject.asObservable();
  public orderBook$ = this.orderBookSubject.asObservable();
  public trades$ = this.tradesSubject.asObservable();
  public connectionStatus$ = this.connectionStatusSubject.asObservable();

  private currentSymbol: string = 'BTCUSDT';

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  connect(symbol: string): void {
    if (!this.isBrowser) return;

    this.currentSymbol = symbol.toUpperCase();
    this.disconnect();

    // Create a new destroy$ Subject for fresh subscriptions
    this.destroy$ = new Subject<void>();

    // Set connection status to true immediately
    this.connectionStatusSubject.next(true);

    // Fetch data immediately
    this.fetchAllData();

    // Poll ticker every 2 seconds
    interval(2000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchTicker();
      });

    // Poll order book every 1 second
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchOrderBook();
      });

    // Poll recent trades every 3 seconds
    interval(3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchRecentTrades();
      });
  }

  private fetchAllData(): void {
    this.fetchTicker();
    this.fetchOrderBook();
    this.fetchRecentTrades();
  }

  private fetchTicker(): void {
    const symbolLower = this.currentSymbol.toLowerCase();
    this.http
      .get<any>(`https://api.binance.com/api/v3/ticker/24hr?symbol=${this.currentSymbol}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const ticker: TickerData = {
            symbol: data.symbol,
            price: parseFloat(data.lastPrice),
            priceChange: parseFloat(data.priceChange),
            priceChangePercent: parseFloat(data.priceChangePercent),
            high24h: parseFloat(data.highPrice),
            low24h: parseFloat(data.lowPrice),
            volume24h: parseFloat(data.volume),
            lastUpdate: new Date(),
          };
          this.tickerSubject.next(ticker);
        },
        error: (error) => {
          console.error('Error fetching ticker:', error);
        },
      });
  }

  private fetchOrderBook(): void {
    this.http
      .get<any>(`https://api.binance.com/api/v3/depth?symbol=${this.currentSymbol}&limit=20`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          const orderBook: OrderBookData = {
            bids: data.bids.map((b: string[]) => [parseFloat(b[0]), parseFloat(b[1])]),
            asks: data.asks.map((a: string[]) => [parseFloat(a[0]), parseFloat(a[1])]),
            lastUpdate: new Date(),
          };
          this.orderBookSubject.next(orderBook);
        },
        error: (error) => {
          console.error('Error fetching order book:', error);
        },
      });
  }

  private fetchRecentTrades(): void {
    this.http
      .get<any[]>(`https://api.binance.com/api/v3/trades?symbol=${this.currentSymbol}&limit=50`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (trades) => {
          // Emit each trade
          trades.forEach((tradeData) => {
            const trade: TradeData = {
              id: tradeData.id.toString(),
              price: parseFloat(tradeData.price),
              quantity: parseFloat(tradeData.qty),
              time: new Date(tradeData.time),
              isBuyerMaker: tradeData.isBuyerMaker,
            };
            this.tradesSubject.next(trade);
          });
        },
        error: (error) => {
          console.error('Error fetching recent trades:', error);
        },
      });
  }

  disconnect(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.connectionStatusSubject.next(false);
  }

  changeSymbol(symbol: string): void {
    this.connect(symbol);
  }
}
