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
  templateUrl: './open-orders.html',
  styleUrl: './open-orders.scss',
})
export class OpenOrdersComponent {}
