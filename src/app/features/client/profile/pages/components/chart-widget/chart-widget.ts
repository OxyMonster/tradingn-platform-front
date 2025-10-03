// chart-widget.component.ts
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

declare const TradingView: any;

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-widget">
      <div #chartContainer class="chart-container"></div>
    </div>
  `,
  styles: [
    `
      .chart-widget {
        width: 100%;
        height: 100%;
        background: #1a1a1a;
      }
      .chart-container {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class ChartWidgetComponent implements OnInit, OnDestroy {
  @Input() symbol: string = 'BTCUSDT';
  @Input() currentPrice: number = 0;

  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  private platformId = inject(PLATFORM_ID);
  private widget: any;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTradingViewWidget();
    }
  }

  ngOnDestroy(): void {
    if (this.widget && this.widget.remove) {
      this.widget.remove();
    }
  }

  private loadTradingViewWidget(): void {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => this.initWidget();
    document.body.appendChild(script);
  }

  private initWidget(): void {
    if (typeof TradingView === 'undefined') return;

    this.widget = new TradingView.widget({
      container_id: this.chartContainer.nativeElement,
      autosize: true,
      symbol: `BINANCE:${this.symbol}`,
      interval: '15',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#1a1a1a',
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      studies: ['RSI@tv-basicstudies', 'MASimple@tv-basicstudies'],
      backgroundColor: '#1a1a1a',
    });
  }
}
