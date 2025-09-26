import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private snackBar = inject(MatSnackBar);

  async copyToClipboard(text: string, appName: string): Promise<void> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        this.snackBar.open(`Copied ${appName} URL to clipboard!`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      } else {
        // Fallback for older browsers or non-secure contexts
        this.fallbackCopyToClipboard(text, appName);
      }
    } catch (err) {
      console.error('Unable to copy to clipboard', err);
      this.fallbackCopyToClipboard(text, appName);
    }
  }

  private fallbackCopyToClipboard(text: string, appName: string): void {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.snackBar.open(`Copied ${appName} URL to clipboard!`, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    } catch (err) {
      console.error('Fallback copy failed', err);
    }

    document.body.removeChild(textArea);
  }
}
