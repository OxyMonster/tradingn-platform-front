import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class NavigationComponent {
  openMenu = signal<string | null>(null);

  // Open submenu on hover
  enterMenu(name: string) {
    this.openMenu.set(name);
  }

  // Close submenu when mouse leaves
  leaveMenu() {
    this.openMenu.set(null);
  }
}
