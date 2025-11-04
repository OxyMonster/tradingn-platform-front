// order-book.component.ts
import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

export interface OrderBookData {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

@Component({
  selector: 'app-order-book',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-book.html',
  styleUrls: ['./order-book.scss'],
})
export class OrderBookComponent {
  // Input signals for reactive data
  orderBookData = signal<OrderBookData>({ bids: [], asks: [] });
  currency = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string>('');

  // Setters for inputs (allows parent to pass data)
  @Input() set data(value: OrderBookData) {
    this.orderBookData.set(value);
  }

  @Input() set pair(value: string) {
    this.currency.set(value);
  }

  @Input() set isLoading(value: boolean) {
    this.loading.set(value);
  }

  @Input() set errorMessage(value: string) {
    this.error.set(value);
  }

  // Computed signals for template
  bids = computed(() => this.orderBookData().bids);
  asks = computed(() => this.orderBookData().asks);

  currentPrice = computed(() => {
    const bidsData = this.bids();
    const asksData = this.asks();

    if (bidsData.length > 0 && asksData.length > 0) {
      return (bidsData[0].price + asksData[0].price) / 2;
    }
    return 0;
  });

  maxBidTotal = computed(() => {
    const bidsData = this.bids();
    if (!bidsData.length) return 0;
    return Math.max(...bidsData.map((b) => b.total));
  });

  maxAskTotal = computed(() => {
    const asksData = this.asks();
    if (!asksData.length) return 0;
    return Math.max(...asksData.map((a) => a.total));
  });

  spread = computed(() => {
    const bidsData = this.bids();
    const asksData = this.asks();

    if (!bidsData.length || !asksData.length) return 0;
    const highestBid = bidsData[0].price;
    const lowestAsk = asksData[0].price;
    return lowestAsk - highestBid;
  });

  getBidGradient(total: number, max: number): string {
    const percentage = (total / max) * 100;
    return `linear-gradient(to left, rgba(14, 203, 129, 0.12) ${percentage}%, transparent ${percentage}%)`;
  }

  getAskGradient(total: number, max: number): string {
    const percentage = (total / max) * 100;
    return `linear-gradient(to left, rgba(246, 70, 93, 0.12) ${percentage}%, transparent ${percentage}%)`;
  }
}
