import { Component } from '@angular/core';
import { Kline, MarketsService } from '../../services/markets.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // ✅
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-markets',
  imports: [CommonModule, HttpClientModule, RouterModule],
  standalone: true,
  providers: [MarketsService],
  templateUrl: './markets.html',
  styleUrl: './markets.scss',
})
export class MarketsComponent {
  klines: Kline[] = [];

  constructor(private marketsService: MarketsService) {}

  ngOnInit() {
    this.marketsService.getKlines('BTCUSDT', '1h', 24).subscribe({
      next: (data) => {
        this.klines = data.map((d: any) => ({
          openTime: d[0],
          open: d[1],
          high: d[2],
          low: d[3],
          close: d[4],
          volume: d[5],
          closeTime: d[6],
          quoteAssetVolume: d[7],
          numberOfTrades: d[8],
          takerBuyBaseAssetVolume: d[9],
          takerBuyQuoteAssetVolume: d[10],
        }));
        console.log(data);
      },
      error: (err) => console.error('Error fetching klines:', err),
    });
  }
}
