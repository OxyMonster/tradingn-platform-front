import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

declare const TradingView: any;

@Component({
  selector: 'app-chart-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-widget.html',
  styleUrls: ['./chart-widget.scss'],
})
export class ChartWidgetComponent implements OnInit, OnDestroy, OnChanges {
  @Input() symbol: string = 'BTCUSDT'; // default symbol
  @ViewChild('chartContainer', { static: true }) chartContainer?: ElementRef;

  private platformId = inject(PLATFORM_ID);
  widget: any = null;
  containerId = 'tradingview-widget-' + Math.floor(Math.random() * 1000000);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadTradingViewScript().then(() => this.initWidget());
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['symbol'] && !changes['symbol'].firstChange) {
      // If symbol changes, reload widget
      if (this.widget && typeof this.widget.remove === 'function') {
        this.widget.remove();
      }
      if (isPlatformBrowser(this.platformId)) {
        this.initWidget();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.widget && typeof this.widget.remove === 'function') {
      this.widget.remove();
    }
  }

  private loadTradingViewScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof TradingView !== 'undefined') {
        resolve();
        return;
      }

      const scriptExists = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (scriptExists) {
        scriptExists.addEventListener('load', () => resolve());
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  private initWidget(): void {
    if (!this.chartContainer?.nativeElement || typeof TradingView === 'undefined') {
      console.warn('TradingView or container not ready');
      return;
    }

    // Clear old widget
    this.chartContainer.nativeElement.innerHTML = '';

    // Create inner div with unique id
    const div = document.createElement('div');
    div.id = this.containerId;
    div.style.width = '100%';
    div.style.height = '100%';
    this.chartContainer.nativeElement.appendChild(div);

    // Initialize TradingView
    this.widget = new TradingView.widget({
      container_id: this.containerId,
      autosize: true,
      symbol: this.symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#1a1a1a',
      enable_publishing: false,
      hide_top_toolbar: true,
      hide_side_toolbar: false,
      allow_symbol_change: false,
      // studies: ['RSI@tv-basicstudies', 'MASimple@tv-basicstudies'],
      backgroundColor: '#0F0F0F',
      gridColor: 'rgba(242, 242, 242, 0.06)',
    });
  }
}
