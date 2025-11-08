import { RouterModule } from '@angular/router';
import { AdminNavigation } from './components/admin-navigation/admin-navigation';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  imports: [AdminNavigation, RouterModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminComponent {}
