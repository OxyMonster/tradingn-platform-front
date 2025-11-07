import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `,
  styles: [
    `
      .loading-overlay {
        widhth: 100%;
        padding: 40px;
        display: flex;
        justify-content: center;
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      p {
        margin-top: 20px;
        color: #667eea;
        font-weight: 600;
      }
    `,
  ],
})
export class LoadingComponent {}
