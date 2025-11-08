import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UtilsService } from '../../../core/services/utils.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class NavigationComponent {
  openMenu = signal<string | null>(null);
  constructor(public authService: AuthService, public utileService: UtilsService) {}

  OnInit() {
    console.log(this.authService.isAuthenticated());
  }
  logout(): void {
    this.authService.logout().subscribe();
  }

  // Open submenu on hover
  enterMenu(name: string) {
    this.openMenu.set(name);
  }

  // Close submenu when mouse leaves
  leaveMenu() {
    this.openMenu.set(null);
  }
}
