import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  getActiveUser() {
    const userRoleString: any = localStorage.getItem('user');

    try {
      const userRole = JSON.parse(userRoleString);
      return userRole;
    } catch (error) {
      console.error('Error parsing user role:', error);
    }
  }
}
