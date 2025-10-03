import { Injectable, signal } from '@angular/core';
import { DialogType, DialogButton } from '../components/dialog/dialog';

export interface DialogConfig {
  type: DialogType;
  title: string;
  message: string;
  buttons: DialogButton[]; // ← Remove optional
  showCloseButton: boolean;
  closeOnOverlayClick: boolean;
  width: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  isOpen = signal<boolean>(false);
  config = signal<DialogConfig>({
    type: 'info',
    title: '',
    message: '',
    buttons: [], // ← Always an array
    showCloseButton: true,
    closeOnOverlayClick: true,
    width: '400px',
  });

  open(config: Partial<DialogConfig>): void {
    this.config.set({
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      buttons: config.buttons || [], // ← Default to empty array
      showCloseButton: config.showCloseButton !== false,
      closeOnOverlayClick: config.closeOnOverlayClick !== false,
      width: config.width || '400px',
    });
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  success(title: string, message: string): void {
    this.open({ type: 'success', title, message });
  }

  error(title: string, message: string): void {
    this.open({ type: 'error', title, message });
  }

  warning(title: string, message: string): void {
    this.open({ type: 'warning', title, message });
  }

  info(title: string, message: string): void {
    this.open({ type: 'info', title, message });
  }

  confirm(title: string, message: string, onConfirm: () => void, onCancel?: () => void): void {
    this.open({
      type: 'confirm',
      title,
      message,
      buttons: [
        {
          label: 'Cancel',
          action: () => {
            this.close();
            if (onCancel) onCancel();
          },
          type: 'secondary',
        },
        {
          label: 'Confirm',
          action: () => {
            this.close();
            onConfirm();
          },
          type: 'primary',
        },
      ],
    });
  }
}
