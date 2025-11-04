import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent {}
