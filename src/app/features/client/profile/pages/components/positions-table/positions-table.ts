// positions-table.component.ts
import { Component, Input, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MarginPosition } from '../../../../../../core/models/trading.model';
import { TradingService } from '../../../../../../core/services/trading.service';

@Component({
  selector: 'app-positions-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <div class="positions-table">
      <div class="positions-header">
        <h3>Open Positions</h3>
        <button mat-icon-button (click)="refreshPositions()" matTooltip="Refresh">
          <mat-icon>refresh</mat-icon>
        </button>
      </div>

      <div class="positions-content" *ngIf="positions().length > 0; else noPositions">
        <table mat-table [dataSource]="positions()" class="table">
          <!-- Symbol Column -->
          <ng-container matColumnDef="symbol">
            <th mat-header-cell *matHeaderCellDef>Symbol</th>
            <td mat-cell *matCellDef="let position">{{ position.symbol }}</td>
          </ng-container>

          <!-- Side Column -->
          <ng-container matColumnDef="side">
            <th mat-header-cell *matHeaderCellDef>Side</th>
            <td mat-cell *matCellDef="let position">
              <span
                class="side-badge"
                [class.long]="position.side === 'buy'"
                [class.short]="position.side === 'sell'"
              >
                {{ position.side === 'buy' ? 'LONG' : 'SHORT' }}
              </span>
            </td>
          </ng-container>

          <!-- Size Column -->
          <ng-container matColumnDef="size">
            <th mat-header-cell *matHeaderCellDef>Size</th>
            <td mat-cell *matCellDef="let position">{{ position.quantity | number : '1.4-4' }}</td>
          </ng-container>

          <!-- Entry Price Column -->
          <ng-container matColumnDef="entryPrice">
            <th mat-header-cell *matHeaderCellDef>Entry Price</th>
            <td mat-cell *matCellDef="let position">
              {{ position.entry_price | number : '1.2-2' }}
            </td>
          </ng-container>

          <!-- Mark Price Column -->
          <ng-container matColumnDef="markPrice">
            <th mat-header-cell *matHeaderCellDef>Mark Price</th>
            <td mat-cell *matCellDef="let position">{{ currentPrice | number : '1.2-2' }}</td>
          </ng-container>

          <!-- Liquidation Price Column -->
          <ng-container matColumnDef="liquidationPrice">
            <th mat-header-cell *matHeaderCellDef>Liq. Price</th>
            <td mat-cell *matCellDef="let position">
              <span class="liq-price" [class.danger]="isNearLiquidation(position)">
                {{ position.liquidation_price | number : '1.2-2' }}
              </span>
            </td>
          </ng-container>

          <!-- Leverage Column -->
          <ng-container matColumnDef="leverage">
            <th mat-header-cell *matHeaderCellDef>Leverage</th>
            <td mat-cell *matCellDef="let position">{{ position.leverage }}x</td>
          </ng-container>

          <!-- Margin Column -->
          <ng-container matColumnDef="margin">
            <th mat-header-cell *matHeaderCellDef>Margin</th>
            <td mat-cell *matCellDef="let position">{{ position.margin | number : '1.2-2' }}</td>
          </ng-container>

          <!-- PNL Column -->
          <ng-container matColumnDef="pnl">
            <th mat-header-cell *matHeaderCellDef>PNL (USDT)</th>
            <td mat-cell *matCellDef="let position">
              <span
                class="pnl"
                [class.profit]="calculatePnL(position) > 0"
                [class.loss]="calculatePnL(position) < 0"
              >
                {{ calculatePnL(position) > 0 ? '+' : ''
                }}{{ calculatePnL(position) | number : '1.2-2' }}
              </span>
            </td>
          </ng-container>

          <!-- PNL % Column -->
          <ng-container matColumnDef="pnlPercent">
            <th mat-header-cell *matHeaderCellDef>PNL %</th>
            <td mat-cell *matCellDef="let position">
              <span
                class="pnl"
                [class.profit]="calculatePnLPercent(position) > 0"
                [class.loss]="calculatePnLPercent(position) < 0"
              >
                {{ calculatePnLPercent(position) > 0 ? '+' : ''
                }}{{ calculatePnLPercent(position) | number : '1.2-2' }}%
              </span>
            </td>
          </ng-container>

          <!-- Actions Column -->
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let position">
              <button
                mat-raised-button
                color="warn"
                (click)="closePosition(position.id)"
                [disabled]="closingPositionId() === position.id"
                size="small"
              >
                {{ closingPositionId() === position.id ? 'Closing...' : 'Close' }}
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </div>

      <ng-template #noPositions>
        <div class="no-positions">
          <mat-icon>inventory_2</mat-icon>
          <p>No open positions</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      .positions-table {
        height: 100%;
        display: flex;
        flex-direction: column;
        background: #1a1a1a;
        color: #fff;
      }

      .positions-header {
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
      }

      .positions-content {
        flex: 1;
        overflow: auto;
      }

      .table {
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

      .side-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;

        &.long {
          background: rgba(38, 166, 154, 0.1);
          color: #26a69a;
        }

        &.short {
          background: rgba(239, 83, 80, 0.1);
          color: #ef5350;
        }
      }

      .liq-price {
        &.danger {
          color: #ef5350;
          font-weight: 600;
        }
      }

      .pnl {
        font-weight: 600;

        &.profit {
          color: #26a69a;
        }

        &.loss {
          color: #ef5350;
        }
      }

      .no-positions {
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
      }

      button {
        font-size: 12px;
      }
    `,
  ],
})
export class PositionsTableComponent implements OnInit, OnDestroy {
  @Input() symbol: string = 'BTCUSDT';
  @Input() currentPrice: number = 0;

  private destroy$ = new Subject<void>();

  positions = signal<MarginPosition[]>([]);
  closingPositionId = signal<number | null>(null);

  displayedColumns: string[] = [
    'symbol',
    'side',
    'size',
    'entryPrice',
    'markPrice',
    'liquidationPrice',
    'leverage',
    'margin',
    'pnl',
    'pnlPercent',
    'actions',
  ];

  constructor(private tradingService: TradingService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadPositions();

    // Refresh positions every 3 seconds
    interval(3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadPositions();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPositions(): void {
    this.tradingService.getPositions().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          // Filter only open positions
          const openPositions = response.data.filter((p) => p.status === 'open');
          this.positions.set(openPositions);
        }
      },
      error: (error) => {
        console.error('Failed to load positions:', error);
      },
    });
  }

  refreshPositions(): void {
    this.loadPositions();
  }

  calculatePnL(position: MarginPosition): number {
    const priceDiff =
      position.side === 'buy'
        ? this.currentPrice - position.entry_price
        : position.entry_price - this.currentPrice;

    return priceDiff * position.quantity;
  }

  calculatePnLPercent(position: MarginPosition): number {
    const pnl = this.calculatePnL(position);
    return (pnl / position.margin) * 100;
  }

  isNearLiquidation(position: MarginPosition): boolean {
    const threshold = 0.05; // 5%

    if (position.side === 'buy') {
      const distanceToLiq = (this.currentPrice - position.liquidation_price) / this.currentPrice;
      return distanceToLiq < threshold;
    } else {
      const distanceToLiq = (position.liquidation_price - this.currentPrice) / this.currentPrice;
      return distanceToLiq < threshold;
    }
  }

  closePosition(positionId: number): void {
    this.closingPositionId.set(positionId);

    this.tradingService.closePosition(positionId).subscribe({
      next: (response) => {
        this.closingPositionId.set(null);
        if (response.success) {
          this.snackBar.open('Position closed successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });
          this.loadPositions();
        }
      },
      error: (error) => {
        this.closingPositionId.set(null);
        this.snackBar.open(error.error?.error || 'Failed to close position', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
