import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  PLATFORM_ID,
  inject,
  effect,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, Subscription, interval, of, timer } from 'rxjs';
import { switchMap, startWith, takeUntil, catchError } from 'rxjs/operators';
import { MarketsService } from '../../../../../core/services/market.service';
import { CryptoPair } from '../../../../../core/models/market.model';
import { MarketsTableComponent } from './markets-table/markets-table';

@Component({
  selector: 'app-markets',
  imports: [CommonModule, FormsModule, RouterLink, MarketsTableComponent],
  standalone: true,
  templateUrl: './markets.html',
  styleUrl: './markets.scss',
})
export class MarketsComponent implements OnInit, OnDestroy {
  private static instanceCount = 0;
  private instanceId: number;

  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private destroy$ = new Subject<void>();

  // UI State
  searchQuery = signal<string>('');
  selectedTab = signal<string>('crypto');
  showFavorites = signal<boolean>(false);
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('desc');
  showVisualization = signal<boolean>(true);
  favorites = signal<Set<string>>(new Set());

  private updateStarted = false; // ← ADD THIS LINE

  // Pagination State
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);

  private updateSubscription?: Subscription;
  private chartCanvases: Map<string, any> = new Map();

  Math = Math;

  constructor(public marketsService: MarketsService) {
    MarketsComponent.instanceCount++;
    this.instanceId = MarketsComponent.instanceCount;
    console.log(
      `MarketsComponent instance #${this.instanceId} created (total: ${MarketsComponent.instanceCount})`
    );

    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      const savedFavorites = localStorage.getItem('crypto_favorites');
      if (savedFavorites) {
        this.favorites.set(new Set(JSON.parse(savedFavorites)));
      }
    }

    effect(() => {
      const page = this.currentPage();
      if (this.showVisualization() && this.isBrowser) {
        setTimeout(() => this.drawAllCharts(), 150);
      }
    });
  }

  // Filtered pairs (before pagination)
  filteredPairs = computed(() => {
    const pairs = this.marketsService.allPairs();

    if (!Array.isArray(pairs)) return [];

    let filtered: CryptoPair[] = [...pairs];
    const query = this.searchQuery().toLowerCase();
    const column = this.sortColumn();
    const direction = this.sortDirection();
    const selectedTab = this.selectedTab();
    const showFavorites = this.showFavorites();
    const favs = this.favorites();

    if (showFavorites) {
      filtered = filtered.filter((pair) => favs.has(pair.symbol));
    }

    if (selectedTab === 'crypto') {
      filtered = filtered.filter((pair) => pair.quote_asset === 'USDT');
    }

    if (query) {
      filtered = filtered.filter(
        (pair) =>
          pair.display_name.toLowerCase().includes(query) ||
          pair.symbol.toLowerCase().includes(query) ||
          pair.base_asset.toLowerCase().includes(query) ||
          (pair.trading_pair && pair.trading_pair.toLowerCase().includes(query))
      );
    }

    if (column) {
      filtered = [...filtered].sort((a, b) => {
        const aVal: any = (a as any)[column];
        const bVal: any = (b as any)[column];

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return 0;
      });
    }

    return filtered;
  });

  // Paginated pairs (what's shown on current page)
  paginatedPairs = computed(() => {
    const filtered = this.filteredPairs();
    const page = this.currentPage();
    const size = this.pageSize();

    const start = (page - 1) * size;
    const end = start + size;

    return filtered.slice(start, end);
  });

  // Total pages
  totalPages = computed(() => {
    const total = this.filteredPairs().length;
    const size = this.pageSize();
    return Math.ceil(total / size);
  });

  // Page numbers to display
  pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const maxVisible = 7;
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  ngOnInit(): void {
    this.loadMarkets();
  }

  ngOnDestroy(): void {
    MarketsComponent.instanceCount--;
    console.log(
      `MarketsComponent instance #${this.instanceId} destroyed (remaining: ${MarketsComponent.instanceCount})`
    );
    this.destroy$.next();
    this.destroy$.complete();
    this.clearAllCharts();
  }

  handleSortChanged(column: string): void {
    this.sortBy(column);
  }

  handleFavoriteToggled(data: { symbol: string; event: Event }): void {
    this.toggleFavorite(data.symbol, data.event);
  }

  handlePairClicked(pair: CryptoPair): void {
    this.goToTrading(pair);
  }

  loadMarkets(): void {
    this.marketsService.getCryptoPairs().subscribe({
      next: () => {
        if (this.showVisualization() && this.isBrowser) {
          setTimeout(() => this.drawAllCharts(), 100);
        }
        this.startRealTimeUpdates();
      },
      error: (error: any) => {
        console.error('Error loading markets:', error);
      },
    });
  }

  // markets.component.ts - update startRealTimeUpdates

  startRealTimeUpdates(): void {
    if (!this.isBrowser) return;

    const pairs = this.marketsService.allPairs();

    if (!Array.isArray(pairs) || pairs.length === 0) {
      console.warn('No pairs available, retrying in 3 seconds...');
      setTimeout(() => {
        if (!this.destroy$.closed) {
          this.updateStarted = false;
          this.startRealTimeUpdates();
        }
      }, 3000);
      return;
    }

    const symbols = pairs.map((pair) => pair.symbol);
    console.log('Starting real-time updates with batching for', symbols.length, 'pairs');

    // Use timer with batching
    timer(10000, 10000)
      .pipe(
        // Start after 10s, repeat every 10s
        takeUntil(this.destroy$),
        switchMap(() => {
          console.log('Fetching market data in batches...');
          return this.marketsService.getMarketDataInBatches(symbols);
        }),
        catchError((error) => {
          console.error('Market data batch error:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            console.log('Market data batch completed:', data.length, 'items');
            this.marketsService.updatePairsWithMarketData(data);

            if (this.showVisualization()) {
              setTimeout(() => this.updateCharts(), 100);
            }
          }
        },
      });
  }

  // Pagination Methods
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);

    if (this.isBrowser) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  nextPage(): void {
    const current = this.currentPage();
    const total = this.totalPages();
    if (current < total) {
      this.goToPage(current + 1);
    }
  }

  previousPage(): void {
    const current = this.currentPage();
    if (current > 1) {
      this.goToPage(current - 1);
    }
  }

  // Other Methods
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    this.currentPage.set(1);
  }

  clearSearch(): void {
    this.searchQuery.set('');
    const searchInput = document.getElementById('markets-search') as HTMLInputElement;
    if (searchInput) searchInput.value = '';
    this.currentPage.set(1);
  }

  toggleFavorites(): void {
    this.showFavorites.update((v) => !v);
    this.currentPage.set(1);
  }

  toggleFavorite(symbol: string, event: Event): void {
    event.stopPropagation();

    const favs = new Set(this.favorites());
    if (favs.has(symbol)) {
      favs.delete(symbol);
    } else {
      favs.add(symbol);
    }

    this.favorites.set(favs);

    if (this.isBrowser) {
      localStorage.setItem('crypto_favorites', JSON.stringify([...favs]));
    }
  }

  isFavorite(symbol: string): boolean {
    return this.favorites().has(symbol);
  }

  selectTab(tab: string): void {
    this.selectedTab.set(tab);
    this.currentPage.set(1);
  }

  sortBy(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.update((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('desc');
    }
    this.currentPage.set(1);
  }

  getSortIcon(column: string): string {
    if (this.sortColumn() !== column) return '';
    return this.sortDirection() === 'asc' ? 'mdi-arrow-up' : 'mdi-arrow-down';
  }

  toggleVisualization(): void {
    this.showVisualization.update((v) => !v);

    if (this.showVisualization()) {
      setTimeout(() => this.drawAllCharts(), 150);
    } else {
      this.clearAllCharts();
    }
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

  onIconError(event: any, pair: CryptoPair): void {
    event.target.src = 'assets/app/img/coins/default.png';
  }

  drawAllCharts(): void {
    if (!this.isBrowser) return;

    const pairs = this.paginatedPairs();
    if (!Array.isArray(pairs)) return;

    pairs.forEach((pair) => {
      this.drawMiniChart(pair);
    });
  }

  drawMiniChart(pair: CryptoPair): void {
    if (!this.isBrowser) return;

    const canvasId = `canvas-${pair.base_asset}`;
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  updateCharts(): void {
    const pairs = this.paginatedPairs();
    if (!Array.isArray(pairs)) return;

    pairs.forEach((pair) => {
      this.drawMiniChart(pair);
    });
  }

  clearAllCharts(): void {
    this.chartCanvases.clear();
  }

  goToTrading(pair: CryptoPair): void {
    // Navigate to trading page
    console.log('Navigate to trading:', pair.symbol);
  }

  refreshData(): void {
    this.loadMarkets();
  }
}
