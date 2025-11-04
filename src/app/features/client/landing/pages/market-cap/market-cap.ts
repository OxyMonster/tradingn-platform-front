import { Component } from '@angular/core';
import { SafeUrlPipe } from '../../../../../shared/pipes/safe-url-pipe';

@Component({
  selector: 'app-market-cap',
  templateUrl: './market-cap.html',
  styleUrls: ['./market-cap.scss'],
  imports: [SafeUrlPipe],
})
export class MarketCapComponent {
  widgetUrl =
    'https://www.tradingview.com/embed-widget/crypto-mkt-screener/?locale=en#%7B%22defaultColumn%22%3A%22overview%22%2C%22screener_type%22%3A%22crypto_mkt%22%2C%22displayCurrency%22%3A%22USD%22%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A550%7D';
}
