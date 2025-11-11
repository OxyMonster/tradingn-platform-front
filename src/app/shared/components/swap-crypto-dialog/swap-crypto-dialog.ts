import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-swap-crypto-dialog',
  imports: [MatDialogModule, MatButtonModule],
  standalone: true,
  templateUrl: './swap-crypto-dialog.html',
  styleUrls: ['./swap-crypto-dialog.scss'],
})
export class SwapCryptoDialog {}
