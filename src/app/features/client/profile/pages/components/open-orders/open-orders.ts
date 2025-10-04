// open-orders.component.ts
import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpotOrder } from '../../../../../../core/models/trading.model';
import { TradingService } from '../../../../../../core/services/trading.service';

@Component({
  selector: 'app-open-orders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="open-orders">
      <div class="orders-header">
        <h3>Open Orders</h3>
        <button mat-icon-button (click)="refreshOrders()" matTooltip="Refresh">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>

      <div class="orders-content" *ngIf="orders().length > 0; else noOrders">
        <table mat-table [dataSource]="orders()" class="orders-table">
          <!-- Time Column -->
          <ng-container matColumnDef="time">
            <th mat-header-cell *matHeaderCellDef>Time</th>
            <td mat-cell *matCellDef="let order">
              {{ order.created_at | date : 'short' }}
            </td>
          </ng-container>

          <!-- Symbol Column -->
          <ng-container matColumnDef="symbol">
            <th mat-header-cell *matHeaderCellDef>Symbol</th>
            <td mat-cell *matCellDef="let order">
              {{ order.symbol }}
            </td>
          </ng-container>

          <!-- Type Column -->
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let order">
              <span class="order-type">{{ order.order_type }}</span>
            </td>
          </ng-container>

          <!-- Side Column -->
          <ng-container matColumnDef="side">
            <th mat-header-cell *matHeaderCellDef>Side</th>
            <td mat-cell *matCellDef="let order">
              <span
                class="side-badge"
                [class.buy]="order.side === 'buy'"
                [class.sell]="order.side === 'sell'"
              >
                {{ order.side }}
              </span>
            </td>
          </ng-container>

          <!-- Price Column -->
          <ng-container matColumnDef="price">
            <th mat-header-cell *matHeaderCellDef>Price</th>
            <td mat-cell *matCellDef="let order">
              {{ order.price | number : '1.2-2' }}
            </td>
          </ng-container>

          <!-- Amount Column -->
          <ng-container matColumnDef="amount">
            <th mat-header-cell *matHeaderCellDef>Amount</th>
            <td mat-cell *matCellDef="let order">
              {{ order.quantity | number : '1.4-4' }}
            </td>
          </ng-container>

          <!-- Filled Column -->
          <ng-container matColumnDef="filled">
            <th mat-header-cell *matHeaderCellDef>Filled</th>
            <td mat-cell *matCellDef="let order">
              {{ order.filled_quantity | number : '1.4-4' }}
            </td>
          </ng-container>

          <!-- Total Column -->
          <ng-container matColumnDef="total">
            <th mat-header-cell *matHeaderCellDef>Total</th>
            <td mat-cell *matCellDef="let order">
              {{ order.price * order.quantity | number : '1.2-2' }}
            </td>
          </ng-container>

          <!-- Status Column -->
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Status</th>
            <td mat-cell *matCellDef="let order">
              <span class="status-badge" [ngClass]="order.status">
                {{ order.status }}
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let order">
              <button
                mat-icon-button
                color="warn"
                (click)="cancelOrder(order.id)"
                matTooltip="Cancel Order"
                [disabled]="cancellingOrderId() === order.id"
              >
                <mat-icon>cancel</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>

      <ng-template #noOrders>
        <div class="no-orders">
          <mat-icon>inbox</mat-icon>
          <p>No open orders</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .open-orders {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #1a1a1a;
        color: #fff;
      }

      .orders-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid #3d3d3d;

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        mat-icon {
          color: #999;
        }
      }

      .orders-content {
        flex: 1;
        overflow: auto;
      }

      .orders-table {
        width: 100%;
        background: transparent;
        color: #fff;

        th {
          background: #1a1a1a;
          color: #999;
          font-size: 12px;
          font-weight: 600;
          padding: 12px 8px;
          border-bottom: 1px solid #3d3d3d;
        }

        td {
          padding: 12px 8px;
          font-size: 13px;
          border-bottom: 1px solid #2d2d2d;
        }

        tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }
      }

      .order-type {
        text-transform: uppercase;
        font-size: 11px;
        color: #999;
      }

      .side-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;

        &.buy {
          background: rgba(38, 166, 154, 0.1);
          color: #26a69a;
        }

        &.sell {
          background: rgba(239, 83, 80, 0.1);
          color: #ef5350;
        }
      }

      .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;

        &.pending {
          background: rgba(255, 152, 0, 0.1);
          color: #ff9800;
        }

        &.open {
          background: rgba(33, 150, 243, 0.1);
          color: #2196f3;
        }

        &.filled {
          background: rgba(76, 175, 80, 0.1);
          color: #4caf50;
        }

        &.cancelled {
          background: rgba(158, 158, 158, 0.1);
          color: #9e9e9e;
        }
      }

      .no-orders {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 300px;
        color: #666;

        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          margin-bottom: 16px;
        }

        p {
          margin: 0;
          font-size: 14px;
        }
      }

      mat-icon {
        color: #999;

        &:hover {
          color: #fff;
        }
      }

      button[color='warn'] mat-icon {
        color: #ef5350;
      }
    `,
  ],
})
export class OpenOrdersComponent implements OnInit, OnDestroy {
  @Input() symbol: string = 'BTCUSDT';

  private destroy$ = new Subject<void>();

  orders = signal<SpotOrder[]>([]);
  cancellingOrderId = signal<number | null>(null);

  displayedColumns: string[] = [
    'time',
    'symbol',
    'type',
    'side',
    'price',
    'amount',
    'filled',
    'total',
    'status',
    'actions',
  ];

  constructor(private tradingService: TradingService) {}

  ngOnInit(): void {
    this.loadOrders();

    // Refresh orders every 5 seconds
    interval(5000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadOrders();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders(): void {
    this.tradingService.getSpotOrders().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filter only open/pending orders
          const openOrders = response.data.filter(
            (order) => order.status === 'open' || order.status === 'pending'
          );
          this.orders.set(openOrders);
        }
      },
      error: (error) => {
        console.error('Failed to load orders:', error);
      },
    });
  }

  refreshOrders(): void {
    this.loadOrders();
  }

  cancelOrder(orderId: number): void {
    this.cancellingOrderId.set(orderId);

    this.tradingService.cancelSpotOrder(orderId).subscribe({
      next: (response) => {
        this.cancellingOrderId.set(null);
        if (response.success) {
          this.loadOrders();
        }
      },
      error: (error) => {
        this.cancellingOrderId.set(null);
        console.error('Failed to cancel order:', error);
      },
    });
  }
}
