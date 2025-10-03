import { Component, signal } from '@angular/core';

interface Coin {
  name: string;
  symbol: string;
  icon: string;
}

@Component({
  selector: 'app-deposit-dialog',
  imports: [],
  templateUrl: './deposit-dialog.html',
  styleUrl: './deposit-dialog.scss',
})
export class DepositDialog {
  openMenu = false; // boolean to track dropdown state

  toggleMenu() {
    this.openMenu = !this.openMenu;
    console.log(this.openMenu);
  }
}
