import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-navigation',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './admin-navigation.html',
  styleUrl: './admin-navigation.scss',
})
export class AdminNavigation {
  opened = true;
}
