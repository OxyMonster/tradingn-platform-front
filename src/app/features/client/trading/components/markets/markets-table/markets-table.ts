import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  PLATFORM_ID,
  inject,
  AfterViewInit,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CryptoPair } from '../../../../../../core/models/market.model';

@Component({
  selector: 'app-markets-table',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './markets-table.html',
  styleUrl: './markets-table.scss',
})
export class MarketsTableComponent implements OnChanges, AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private chartCanvases: Map<string, any> = new Map();

  @Input() pairs: CryptoPair[] = [];
  @Input() showVisualization: boolean = true;
  @Input() favorites: Set<string> = new Set();
  @Input() sortColumn: string = '';
  @Input() sortDirection: 'asc' | 'desc' = 'desc';

  @Input() showFavorites: boolean = true;
  @Input() showTradeButton: boolean = true;
  @Input() enableSorting: boolean = true;
  @Input() enableRowClick: boolean = true;

  @Output() sortChanged = new EventEmitter<string>();
  @Output() favoriteToggled = new EventEmitter<{ symbol: string; event: Event }>();
  @Output() pairClicked = new EventEmitter<CryptoPair>();

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (this.showVisualization && this.isBrowser) {
      setTimeout(() => this.drawAllCharts(), 100);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Redraw charts when pairs data changes
    if (
      changes['pairs'] &&
      !changes['pairs'].firstChange &&
      this.showVisualization &&
      this.isBrowser
    ) {
      setTimeout(() => this.drawAllCharts(), 100);
    }
  }

  onSort(column: string): void {
    if (this.enableSorting) {
      this.sortChanged.emit(column);
    }
  }

  onToggleFavorite(symbol: string, event: Event): void {
    if (this.showFavorites) {
      this.favoriteToggled.emit({ symbol, event });
    }
  }

  onPairClick(pair: CryptoPair): void {
    if (this.enableRowClick) {
      this.pairClicked.emit(pair);
    }
  }

  isFavorite(symbol: string): boolean {
    return this.favorites.has(symbol);
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down';
  }

  getPriceChangeClass(change: number): string {
    if (change > 0) return 'up';
    if (change < 0) return 'down';
    return '';
  }

  getCoinIcon(symbol: string): string {
    const baseAsset = symbol.replace('USDT', '');
    return `assets/app/img/coins/${baseAsset}.png`;
  }

  onIconError(event: any): void {
    event.target.src = 'assets/app/img/coins/BAT.png';
  }

  // Chart drawing methods
  drawAllCharts(): void {
    if (!this.isBrowser || !this.pairs) return;

    this.pairs.forEach((pair) => {
      this.drawMiniChart(pair);
    });
  }

  drawMiniChart(pair: CryptoPair): void {
    if (!this.isBrowser) return;

    const canvasId = `canvas-${pair.base_asset}`;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    if (!canvas) {
      console.warn(`Canvas not found for ${pair.base_asset}`);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate mock price data
    const dataPoints = 20;
    const data: number[] = [];
    const basePrice = pair.last_price || 100;

    for (let i = 0; i < dataPoints; i++) {
      const variation = (Math.random() - 0.5) * (basePrice * 0.02);
      data.push(basePrice + variation);
    }

    const maxPrice = Math.max(...data);
    const minPrice = Math.min(...data);
    const priceRange = maxPrice - minPrice || 1;

    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = (pair.price_change_percent || 0) >= 0 ? '#4caf50' : '#f44336';

    data.forEach((price, index) => {
      const x = (index / (dataPoints - 1)) * canvas.width;
      const y = canvas.height - ((price - minPrice) / priceRange) * canvas.height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
    this.chartCanvases.set(pair.symbol, { canvas, data });
  }
}
