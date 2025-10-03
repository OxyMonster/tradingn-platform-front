import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // ✅
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-markets',
  imports: [CommonModule, HttpClientModule, RouterModule],
  standalone: true,
  templateUrl: './markets.html',
  styleUrl: './markets.scss',
})
export class MarketsComponent {
  constructor() {}

  ngOnInit() {}
}
