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
      <div #chartContainer id="tradingview-widget" class="chart-container"></div>
      <div class="chart-placeholder" *ngIf="!widget">
        <div class="loading-text">Loading chart...</div>
      </div>
    </div>
  `,
  styles: [
    `
      .chart-widget {
        width: 100%;
        height: 100%;
        background: #1a1a1a;
        position: relative;
        min-height: 500px;
      }

      .chart-container {
        width: 100%;
        height: 100%;
        min-height: 500px;
      }

      .chart-placeholder {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #1a1a1a;
        z-index: 1;
      }

      .loading-text {
        color: #999;
        font-size: 14px;
      }
    `,
  ],
})
export class ChartWidgetComponent implements OnInit, OnDestroy {
  @Input() symbol: string = 'BTCUSDT';
  @Input() currentPrice: number = 0;

  @ViewChild('chartContainer') chartContainer?: ElementRef;

  private platformId = inject(PLATFORM_ID);
  widget: any = null; // Changed to public so template can access it

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Delay initialization to ensure DOM is ready
      setTimeout(() => {
        this.loadTradingViewWidget();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    if (this.widget && this.widget.remove) {
      this.widget.remove();
    }
  }

  private loadTradingViewWidget(): void {
    // Check if container exists
    if (!this.chartContainer?.nativeElement) {
      console.warn('Chart container not available yet');
      return;
    }

    // Check if TradingView is already loaded
    if (typeof TradingView !== 'undefined') {
      this.initWidget();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => this.initWidget();
    script.onerror = () => console.error('Failed to load TradingView script');
    document.head.appendChild(script);
  }

  private initWidget(): void {
    if (typeof TradingView === 'undefined') {
      console.warn('TradingView library not loaded');
      return;
    }

    if (!this.chartContainer?.nativeElement) {
      console.warn('Chart container not available');
      return;
    }

    try {
      this.widget = new TradingView.widget({
        container: this.chartContainer.nativeElement,
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
    } catch (error) {
      console.error('Error initializing TradingView widget:', error);
    }
  }
}
