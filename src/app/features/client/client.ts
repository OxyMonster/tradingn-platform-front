import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { NavigationComponent } from '../../shared/components/navigation/navigation';
import { FooterComponent } from '../../shared/components/footer/footer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, FooterComponent],
  templateUrl: './client.html',
  styleUrl: './client.scss',
})
export class Client {
  showFooter = true;
  isLoading = signal(true);
  private platformId = inject(PLATFORM_ID);
  protected readonly title = signal('trading-platform-client');

  constructor(private authService: AuthService, private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;

        // Hide footer for all /profile/spot/... routes
        const shouldHide = /^\/profile\/spot\/[^/]+$/.test(url);

        this.showFooter = !shouldHide;
      });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.isLoading.set(false);
      }, 50);
    } else {
      this.isLoading.set(false);
    }
  }
}
