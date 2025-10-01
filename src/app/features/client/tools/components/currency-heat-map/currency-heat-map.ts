import { Component } from '@angular/core';
import { SafeUrlPipe } from '../../../../../shared/pipes/safe-url-pipe';

@Component({
  selector: 'app-currency-heat-map',
  imports: [SafeUrlPipe],
  templateUrl: './currency-heat-map.html',
  styleUrl: './currency-heat-map.scss',
})
export class CurrencyHeatMapComponent {
  widgetUrl =
    'https://www.tradingview.com/embed-widget/forex-heat-map/?locale=en#%7B%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22currencies%22%3A%5B%22EUR%22%2C%22USD%22%2C%22JPY%22%2C%22GBP%22%2C%22CHF%22%2C%22AUD%22%2C%22CAD%22%2C%22NZD%22%2C%22CNY%22%2C%22TRY%22%2C%22SEK%22%2C%22NOK%22%2C%22DKK%22%2C%22ZAR%22%2C%22HKD%22%5D%2C%22backgroundColor%22%3A%22%23ffffff%22%2C%22width%22%3A550%2C%22height%22%3A400%7D';
}
