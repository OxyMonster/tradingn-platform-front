import { Component } from '@angular/core';
import { SafeUrlPipe } from '../../../../../shared/pipes/safe-url-pipe';

@Component({
  selector: 'app-technical-analysis',
  imports: [SafeUrlPipe],
  templateUrl: './technical-analysis.html',
  styleUrl: './technical-analysis.scss',
})
export class TechnicalAnalysisComponent {
  btcUrl =
    'https://www.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22displayMode%22%3A%22single%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22interval%22%3A%221m%22%2C%22disableInterval%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22BINANCE%3ABTCUSDT%22%2C%22showIntervalTabs%22%3Atrue%7D';
  ethUrl =
    'https://www.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22displayMode%22%3A%22single%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22interval%22%3A%221m%22%2C%22disableInterval%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22BINANCE%3AETHUSDT%22%2C%22showIntervalTabs%22%3Atrue%7D';
  tonUrl =
    'https://www.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22displayMode%22%3A%22single%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22interval%22%3A%221m%22%2C%22disableInterval%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22BINANCE%3ATONUSDT%22%2C%22showIntervalTabs%22%3Atrue%7D';
  bnbUrl =
    'https://www.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22displayMode%22%3A%22single%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22interval%22%3A%221m%22%2C%22disableInterval%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22BINANCE%3ABNBUSDT%22%2C%22showIntervalTabs%22%3Atrue%7D';
  solUrl =
    'https://www.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22displayMode%22%3A%22single%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22interval%22%3A%221m%22%2C%22disableInterval%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22BINANCE%3ASOLUSDT%22%2C%22showIntervalTabs%22%3Atrue%7D';
  xrpUrl =
    'https://www.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22displayMode%22%3A%22single%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22interval%22%3A%221m%22%2C%22disableInterval%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22BINANCE%3AXRPUSDT%22%2C%22showIntervalTabs%22%3Atrue%7D';
  dogeUrl =
    'https://www.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22displayMode%22%3A%22single%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22interval%22%3A%221m%22%2C%22disableInterval%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22BINANCE%3ADOGEUSDT%22%2C%22showIntervalTabs%22%3Atrue%7D';
  trxUrl =
    'https://www.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22displayMode%22%3A%22single%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22interval%22%3A%221m%22%2C%22disableInterval%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22BINANCE%3ATRXUSDT%22%2C%22showIntervalTabs%22%3Atrue%7D';
  adaUrl =
    'https://www.tradingview.com/embed-widget/technical-analysis/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22displayMode%22%3A%22single%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22interval%22%3A%221m%22%2C%22disableInterval%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22symbol%22%3A%22BINANCE%3AADAUSDT%22%2C%22showIntervalTabs%22%3Atrue%7D';
}
