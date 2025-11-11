import { Component } from '@angular/core';

@Component({
  selector: 'app-client-transfer-crypto-dialog',
  imports: [],
  standalone: true,
  templateUrl: './client-transfer-crypto-dialog.html',
  styleUrl: './client-transfer-crypto-dialog.scss',
})
export class ClientTransferCryptoDialog {
  openMenu!: boolean;

  toggleMenu() {
    console.log('toggle');
  }
}
