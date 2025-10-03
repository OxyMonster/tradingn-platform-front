import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  OnInit,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

export type DialogType = 'success' | 'error' | 'warning' | 'info' | 'confirm' | 'custom';

export interface DialogButton {
  label: string;
  action: () => void;
  type?: 'primary' | 'secondary' | 'danger';
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
  animations: [
    trigger('dialogAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
      ]),
    ]),
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DialogComponent implements OnInit {
  @Input() isOpen = signal<boolean>(false);
  @Input() type: DialogType = 'info';
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() buttons: DialogButton[] = []; // ← Already has default value
  @Input() showCloseButton: boolean = true;
  @Input() closeOnOverlayClick: boolean = true;
  @Input() width: string = '400px';

  @Output() closed = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.buttons.length === 0) {
      this.setDefaultButtons();
    }
  }

  private setDefaultButtons(): void {
    if (this.type === 'confirm') {
      this.buttons = [
        {
          label: 'Cancel',
          action: () => this.close(),
          type: 'secondary',
        },
        {
          label: 'Confirm',
          action: () => this.confirm(),
          type: 'primary',
        },
      ];
    } else {
      this.buttons = [
        {
          label: 'OK',
          action: () => this.close(),
          type: 'primary',
        },
      ];
    }
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  confirm(): void {
    this.close();
  }

  onOverlayClick(): void {
    if (this.closeOnOverlayClick) {
      this.close();
    }
  }

  onDialogClick(event: Event): void {
    event.stopPropagation();
  }

  getIcon(): string {
    switch (this.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'confirm':
        return '?';
      default:
        return '';
    }
  }

  getIconClass(): string {
    return `dialog-icon icon-${this.type}`;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen()) {
      this.close();
    }
  }
}
