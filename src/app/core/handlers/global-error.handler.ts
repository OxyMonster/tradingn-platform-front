import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Silently ignore AbortError - it's expected when requests are cancelled
    if (
      error?.name === 'AbortError' ||
      error?.rejection?.name === 'AbortError' ||
      error?.message?.includes('AbortError') ||
      error?.message?.includes('aborted') ||
      error?.toString()?.includes('AbortError') ||
      error?.toString()?.includes('aborted') ||
      (error?.rejection instanceof DOMException && error.rejection.name === 'AbortError') ||
      (error instanceof DOMException && error.name === 'AbortError') ||
      error?.error?.name === 'AbortError' ||
      error?.promise?.toString()?.includes('AbortError')
    ) {
      // Silently ignore - this is expected when changing symbols or disconnecting
      return;
    }

    // Check if it's a promise rejection with AbortError
    if (error?.rejection) {
      const rejection = error.rejection;
      if (
        rejection.name === 'AbortError' ||
        rejection.message?.includes('AbortError') ||
        rejection.toString?.()?.includes('AbortError')
      ) {
        return;
      }
    }

    // Log other errors normally
    console.error('Global error caught:', error);
  }
}
