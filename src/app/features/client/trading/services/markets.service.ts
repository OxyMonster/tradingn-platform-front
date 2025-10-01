// src/app/services/binance.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Kline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
}

@Injectable({
  providedIn: 'root',
})
export class MarketsService {
  private http = inject(HttpClient);
  private baseUrl = 'https://api.binance.com/api/v3/klines';

  getKlines(symbol: string, interval: string, limit: number = 24): Observable<Kline[]> {
    return this.http.get<Kline[]>(
      `${this.baseUrl}?symbol=${symbol}&interval=${interval}&limit=${limit}`
    );
  }
}
