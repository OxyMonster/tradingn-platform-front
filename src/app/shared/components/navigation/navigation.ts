import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UtilsService } from '../../../core/services/utils.service';
import { DialogModule } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { DepositDialog } from '../deposit-dialog/deposit-dialog';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule, DialogModule, DepositDialog],
  standalone: true,
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class NavigationComponent {
  openMenu = signal<string | null>(null);
  constructor(public authService: AuthService, public utileService: UtilsService) {}
  readonly dialog = inject(MatDialog);

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

  openDepositDialog() {
    this.dialog.open(DepositDialog, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
    });
  }
}
