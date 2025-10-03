// shared/components/tradingview-widget/tradingview-widget.component.ts
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare const TradingView: any;

@Component({
  selector: 'app-tradingview-widget',
  standalone: true,
  template: ` <div #tradingviewWidget class="tradingview-widget"></div> `,
  styles: [
    `
      .tradingview-widget {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class TradingViewWidgetComponent implements OnInit, OnDestroy {
  @Input() symbol: string = 'BINANCE:BTCUSDT';
  @Input() interval: string = 'D';
  @Input() theme: 'light' | 'dark' = 'light';
  @Input() widgetType: 'chart' | 'mini' = 'chart';
  @Input() height: number = 500;

  @ViewChild('tradingviewWidget', { static: true }) widgetContainer!: ElementRef;

  private platformId = inject(PLATFORM_ID);
  private widget: any;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTradingViewScript();
    }
  }

  ngOnDestroy(): void {
    if (this.widget && this.widget.remove) {
      this.widget.remove();
    }
  }

  private loadTradingViewScript(): void {
    // Check if script already loaded
    if (typeof TradingView !== 'undefined') {
      this.initWidget();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => this.initWidget();
    document.body.appendChild(script);
  }

  private initWidget(): void {
    if (this.widgetType === 'mini') {
      this.initMiniWidget();
    } else {
      this.initChartWidget();
    }
  }

  private initChartWidget(): void {
    this.widget = new TradingView.widget({
      container_id: this.widgetContainer.nativeElement.id || 'tradingview_widget',
      autosize: true,
      symbol: this.symbol,
      interval: this.interval,
      timezone: 'Etc/UTC',
      theme: this.theme,
      style: '1',
      locale: 'en',
      toolbar_bg: '#f1f3f6',
      enable_publishing: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      height: this.height,
      studies: ['MASimple@tv-basicstudies'],
    });
  }

  private initMiniWidget(): void {
    const container = this.widgetContainer.nativeElement;
    container.innerHTML = `
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
      </div>
    `;

    new TradingView.MiniChart({
      container_id: container.querySelector('.tradingview-widget-container__widget'),
      symbol: this.symbol,
      width: '100%',
      height: this.height,
      locale: 'en',
      dateRange: '1D',
      colorTheme: this.theme,
      trendLineColor: 'rgba(41, 98, 255, 1)',
      underLineColor: 'rgba(41, 98, 255, 0.3)',
      isTransparent: false,
      autosize: true,
    });
  }

  // Update symbol dynamically
  updateSymbol(newSymbol: string): void {
    this.symbol = newSymbol;
    if (this.widget && this.widget.setSymbol) {
      this.widget.setSymbol(newSymbol, this.interval);
    }
  }
}
