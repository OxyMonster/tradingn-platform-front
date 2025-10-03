import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DialogService } from '../../shared/services/dialog.service';
import { isPlatformBrowser } from '@angular/common';
import { NavigationComponent } from '../../shared/components/navigation/navigation';
import { FooterComponent } from '../../shared/components/footer/footer';
import { DialogComponent } from '../../shared/components/dialog/dialog';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent, DialogComponent],
  templateUrl: './client.html',

  styleUrl: './client.scss',
})
export class Client {
  isLoading = signal(true);
  private platformId = inject(PLATFORM_ID);
  protected readonly title = signal('trading-platform-client');

  constructor(private authService: AuthService, public dialogService: DialogService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Give auth time to load from localStorage
      setTimeout(() => {
        this.isLoading.set(false);
      }, 50);
    } else {
      this.isLoading.set(false);
    }
  }
}
