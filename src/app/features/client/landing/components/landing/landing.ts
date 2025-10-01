import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {}
