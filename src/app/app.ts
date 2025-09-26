import { NgClass } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Environment, EnvironmentGroup } from './models/application.model';
import { ApplicationDataService } from './services/application-data.service';
import { ClipboardService } from './services/clipboard.service';
import { EnvironmentConfigService } from './services/environment-config.service';

@Component({
  selector: 'app-root',
  imports: [NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  selectedEnvironment = signal<Environment>('dev');
  searchTerm = signal<string>('');

  private applicationDataService = inject(ApplicationDataService);
  private environmentConfigService = inject(EnvironmentConfigService);
  private clipboardService = inject(ClipboardService);
  private snackBar = inject(MatSnackBar);

  // Getter for available environments
  get availableEnvironments(): Environment[] {
    return this.environmentConfigService.getAvailableEnvironments();
  }

  // Getter for environment display names
  get environmentDisplayNames() {
    return this.environmentConfigService.environmentDisplayNames;
  }

  // Getter for environment colors
  get environmentColors() {
    return this.environmentConfigService.environmentColors;
  }

  // A computed signal that returns the applications for the currently selected environment, filtered by the search term.
  visibleEnvironment = computed((): EnvironmentGroup[] => {
    const selected = this.selectedEnvironment();
    const term = this.searchTerm();

    const filteredApps = this.applicationDataService.searchApplications(selected, term);

    return [{ environment: selected, apps: filteredApps }];
  });

  // Method to update the selected environment and clear the search term
  selectEnvironment(env: Environment): void {
    this.selectedEnvironment.set(env);
    this.searchTerm.set(''); // Clear search when changing environment
  }

  // Method to update the search term signal on input
  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  // Method to copy text to clipboard
  copyToClipboard(text: string, appName: string): void {
    this.clipboardService.copyToClipboard(text, appName);
  }
}
