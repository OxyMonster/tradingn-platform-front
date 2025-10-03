import { RouterModule } from '@angular/router';
import { AdminNavigation } from './components/admin-navigation/admin-navigation';
import { Component } from '@angular/core';
import { AdminHeader as AdminHeaderComponent } from './components/admin-header/admin-header';

@Component({
  selector: 'app-admin',
  imports: [AdminNavigation, AdminHeaderComponent, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent {}
