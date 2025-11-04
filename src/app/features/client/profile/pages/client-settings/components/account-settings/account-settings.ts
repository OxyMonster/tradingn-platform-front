import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UserData {
  id: string;
  username: string;
  email: string;
  is_vip: boolean;
  google_2fa_secret: boolean;
}

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.scss',
})
export class AccountSettingsComponent implements OnInit {
  user: UserData | null = null;

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    if (typeof localStorage !== 'undefined') {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        try {
          this.user = JSON.parse(userDataString) as UserData;
          console.log('User data loaded:', this.user);
        } catch (e) {
          console.error('Error parsing user data from localStorage', e);
          this.user = null;
        }
      } else {
        console.log('No user data found in localStorage.');
      }
    } else {
      console.warn('localStorage is not available.');
    }
  }
}
