import { Component } from '@angular/core';
import { SafeUrlPipe } from '../../../../../shared/pipes/safe-url-pipe';

@Component({
  selector: 'app-market-screener',
  imports: [SafeUrlPipe],
  templateUrl: './market-screener.html',
  styleUrl: './market-screener.scss',
})
export class MarketScreenerComponent {
  widgetUrl =
    'https://www.tradingview.com/embed-widget/screener/?locale=en#%7B%22market%22%3A%22crypto%22%2C%22showToolbar%22%3Atrue%2C%22defaultColumn%22%3A%22overview%22%2C%22defaultScreen%22%3A%22general%22%2C%22isTransparent%22%3Afalse%2C%22locale%22%3A%22en%22%2C%22colorTheme%22%3A%22light%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A550%7D';
}
