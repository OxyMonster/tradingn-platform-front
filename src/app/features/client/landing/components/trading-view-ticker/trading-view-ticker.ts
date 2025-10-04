import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-tradingview-ticker',
  templateUrl: './trading-view-ticker.html',
  styleUrls: ['./trading-view-ticker.scss'],
})
export class TradingviewTickerComponent implements AfterViewInit {
  ngAfterViewInit() {
    this.loadTradingViewWidget();
  }

  loadTradingViewWidget() {
    // Remove existing script if already loaded
    const oldScript = document.getElementById('tradingview-widget-script');
    if (oldScript) {
      oldScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'tradingview-widget-script';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;

    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500 Index' },
        { proName: 'FOREXCOM:NSXUSD', title: 'US 100 Cash CFD' },
        { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
        { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
        { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
      ],
      colorTheme: 'light',
      locale: 'en',
      isTransparent: true,
      showSymbolLogo: true,
      displayMode: 'regular',
    });

    document.getElementById('tradingview-ticker')?.appendChild(script);
  }
}
