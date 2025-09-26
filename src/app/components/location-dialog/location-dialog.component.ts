import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BusinessInfo, Location } from '../../models/business.model';
import { BusinessDataService } from '../../services/business-data.service';
import { LocationSelectionService } from '../../services/location-selection.service';

export interface LocationDialogData {
  business: BusinessInfo;
  chainId: string;
}

@Component({
  selector: 'app-location-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltipModule,
    MatRadioModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  template: `
    <div class="location-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <div class="business-info">
          <h2 mat-dialog-title>{{ data.business.chainName }}</h2>
          <p class="business-details">
            <span class="chain-id">Chain ID: {{ data.business.chainId }}</span>
            <span class="legal-name">{{ data.business.legalName }}</span>
          </p>
        </div>
        <button mat-icon-button mat-dialog-close class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading locations...</p>
      </div>

      <!-- Locations Table -->
      <div *ngIf="!isLoading" class="locations-content">
        <div class="locations-header">
          <div class="header-left">
            <h3>Locations ({{ filteredLocations.length }})</h3>
            <p class="header-description">
              Select a location using the radio button, then click "Add Location"
            </p>
          </div>
          <div class="header-right">
            <div class="location-stats">
              <mat-chip-set>
                <mat-chip color="primary">
                  <mat-icon matChipAvatar>location_on</mat-icon>
                  {{ activeLocationsCount }} Active
                </mat-chip>
                <mat-chip color="warn">
                  <mat-icon matChipAvatar>location_off</mat-icon>
                  {{ inactiveLocationsCount }} Inactive
                </mat-chip>
              </mat-chip-set>
            </div>
          </div>
        </div>

        <!-- Search -->
        <div class="search-section">
          <mat-form-field appearance="outline" class="search-field">
            <input
              matInput
              [(ngModel)]="searchTerm"
              (input)="onSearchChange()"
              placeholder="Search by name, address, or city..."
              autocomplete="off"
            />
            <mat-icon matSuffix>search</mat-icon>
            <button
              mat-icon-button
              matSuffix
              *ngIf="searchTerm"
              (click)="clearSearch()"
              matTooltip="Clear search"
            >
              <mat-icon>clear</mat-icon>
            </button>
          </mat-form-field>
        </div>

        <div *ngIf="filteredLocations.length > 0" class="table-container">
          <table mat-table [dataSource]="filteredLocations" class="locations-table">
            <!-- Selection Column -->
            <ng-container matColumnDef="select">
              <th mat-header-cell *matHeaderCellDef>Select</th>
              <td mat-cell *matCellDef="let location">
                <mat-radio-button
                  [value]="location.id"
                  [checked]="isLocationSelected(location.id)"
                  (change)="selectLocation(location.id)"
                  [disabled]="isAnyLocationBeingAdded"
                >
                </mat-radio-button>
              </td>
            </ng-container>

            <!-- Location Name Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Location Name</th>
              <td mat-cell *matCellDef="let location">
                <div class="location-name">
                  <mat-icon [class]="location.isActive ? 'active-icon' : 'inactive-icon'">
                    {{ location.isActive ? 'location_on' : 'location_off' }}
                  </mat-icon>
                  <span [class]="location.isActive ? 'active-text' : 'inactive-text'">
                    {{ location.name }}
                  </span>
                </div>
              </td>
            </ng-container>

            <!-- Address Column -->
            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Address</th>
              <td mat-cell *matCellDef="let location">
                <div class="address-details">
                  <div class="street">{{ location.address }}</div>
                  <div class="city-state">
                    {{ location.city }}, {{ location.state }} {{ location.postalCode }}
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Contact Column -->
            <ng-container matColumnDef="contact">
              <th mat-header-cell *matHeaderCellDef>Contact</th>
              <td mat-cell *matCellDef="let location">
                <div class="contact-info">
                  <div *ngIf="location.phone" class="phone">
                    <mat-icon>phone</mat-icon>
                    <span>{{ location.phone }}</span>
                  </div>
                  <div *ngIf="location.email" class="email">
                    <mat-icon>email</mat-icon>
                    <span>{{ location.email }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Status Column -->
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let location">
                <mat-chip [color]="location.isActive ? 'primary' : 'warn'">
                  {{ location.isActive ? 'Active' : 'Inactive' }}
                </mat-chip>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let location">
                <button
                  mat-icon-button
                  (click)="copyLocationInfo(location)"
                  matTooltip="Copy location information"
                >
                  <mat-icon>content_copy</mat-icon>
                </button>
                <button mat-icon-button (click)="viewOnMap(location)" matTooltip="View on map">
                  <mat-icon>map</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              [class.inactive-row]="!row.isActive"
            ></tr>
          </table>
        </div>

        <!-- No Locations Message -->
        <div *ngIf="locations.length === 0" class="no-locations">
          <mat-icon>location_off</mat-icon>
          <h3>No locations found</h3>
          <p>This chain doesn't have any registered locations.</p>
        </div>

        <!-- No Search Results Message -->
        <div *ngIf="locations.length > 0 && filteredLocations.length === 0" class="no-results">
          <mat-icon>search_off</mat-icon>
          <h3>No locations match your search</h3>
          <p>Try adjusting your search terms or filters.</p>
          <button mat-button (click)="clearSearch()">
            <mat-icon>clear</mat-icon>
            Clear Search
          </button>
        </div>
      </div>

      <!-- Dialog Actions -->
      <div mat-dialog-actions class="dialog-actions">
        <div class="actions-left">
          <button mat-button (click)="refreshLocations()" [disabled]="isLoading">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
          <button
            mat-raised-button
            color="primary"
            (click)="addSelectedLocation()"
            [disabled]="!hasSelection || isAnyLocationBeingAdded"
            *ngIf="hasSelection"
          >
            <mat-icon *ngIf="!isAnyLocationBeingAdded">add_location</mat-icon>
            <mat-spinner *ngIf="isAnyLocationBeingAdded" diameter="20"></mat-spinner>
            {{ isAnyLocationBeingAdded ? 'Adding...' : 'Add Selected Location' }}
          </button>
        </div>
        <div class="actions-right">
          <button
            mat-button
            (click)="clearSelection()"
            [disabled]="!hasSelection || isAnyLocationBeingAdded"
          >
            <mat-icon>clear</mat-icon>
            Clear Selection
          </button>
          <button mat-button mat-dialog-close>Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .location-dialog {
        max-width: 100%;
        padding: 24px;
      }

      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        padding: 0 0 15px 0;
        border-bottom: 2px solid #e0e0e0;
      }

      .business-info h2 {
        margin: 0 0 8px 0;
        color: #1976d2;
        font-size: 24px;
      }

      .business-details {
        margin: 0;
        color: #666;
        font-size: 14px;
      }

      .chain-id {
        font-family: 'Courier New', monospace;
        background-color: #f0f0f0;
        padding: 2px 6px;
        border-radius: 3px;
        margin-right: 10px;
      }

      .close-button {
        margin-left: 20px;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        color: #666;
      }

      .loading-container p {
        margin-top: 15px;
        font-size: 16px;
      }

      .locations-content {
        min-height: 300px;
        padding: 0 0 20px 0;
      }

      .locations-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .locations-header h3 {
        margin: 0;
        color: #333;
        font-size: 18px;
      }

      .location-stats {
        display: flex;
        gap: 10px;
      }

      .table-container {
        overflow-x: auto;
      }

      .locations-table {
        width: 100%;
        min-width: 600px;
      }

      .locations-table th {
        background-color: #f5f5f5;
        font-weight: 600;
        color: #333;
        font-size: 14px;
      }

      .locations-table td {
        padding: 12px 8px;
        border-bottom: 1px solid #e0e0e0;
      }

      .inactive-row {
        background-color: #fafafa;
        opacity: 0.7;
      }

      .location-name {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .active-icon {
        color: #4caf50;
      }

      .inactive-icon {
        color: #f44336;
      }

      .active-text {
        color: #333;
        font-weight: 500;
      }

      .inactive-text {
        color: #666;
      }

      .address-details {
        font-size: 13px;
        line-height: 1.4;
      }

      .street {
        font-weight: 500;
        color: #333;
      }

      .city-state {
        color: #666;
        margin-top: 2px;
      }

      .contact-info {
        font-size: 13px;
      }

      .phone,
      .email {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
      }

      .phone mat-icon,
      .email mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: #666;
      }

      .no-locations {
        text-align: center;
        padding: 40px;
        color: #666;
      }

      .no-locations mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        color: #ccc;
      }

      .no-locations h3 {
        margin: 0 0 8px 0;
        color: #333;
      }

      .no-locations p {
        margin: 0;
        font-size: 14px;
      }

      .dialog-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #e0e0e0;
      }

      .actions-left {
        display: flex;
        gap: 10px;
        align-items: center;
      }

      .actions-right {
        display: flex;
        gap: 10px;
      }

      .locations-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 20px;
        gap: 20px;
      }

      .header-left {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .header-description {
        margin: 0;
        color: #666;
        font-size: 14px;
        font-style: italic;
      }

      .header-right {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 10px;
      }

      .locations-table th:first-child,
      .locations-table td:first-child {
        width: 80px;
        text-align: center;
      }

      .locations-table td:first-child {
        padding: 8px;
      }

      .adding {
        opacity: 0.7;
      }

      button[mat-raised-button] {
        min-width: 160px;
        font-size: 14px;
      }

      button[mat-raised-button] mat-spinner {
        margin-right: 8px;
      }

      mat-radio-button {
        margin: 0;
      }

      .actions-left {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-wrap: wrap;
      }

      .actions-right {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .search-section {
        margin-bottom: 20px;
      }

      .search-field {
        width: 100%;
        max-width: 400px;
      }

      .table-container {
        max-height: 500px;
        overflow-y: auto;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
      }

      .locations-table {
        width: 100%;
        min-width: 800px;
      }

      .no-results {
        text-align: center;
        padding: 40px;
        color: #666;
      }

      .no-results mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        color: #ccc;
      }

      .no-results h3 {
        margin: 0 0 8px 0;
        color: #333;
      }

      .no-results p {
        margin: 0 0 16px 0;
        font-size: 14px;
      }

      @media (max-width: 768px) {
        .dialog-header {
          flex-direction: column;
          align-items: flex-start;
        }

        .close-button {
          margin-left: 0;
          margin-top: 10px;
        }

        .locations-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }

        .search-field {
          max-width: 100%;
        }

        .table-container {
          max-height: 400px;
        }
      }
    `,
  ],
})
export class LocationDialogComponent implements OnInit {
  locations: Location[] = [];
  filteredLocations: Location[] = [];
  isLoading = false;
  activeLocationsCount = 0;
  inactiveLocationsCount = 0;

  // Search properties
  searchTerm = '';

  // Location addition properties
  get isAnyLocationBeingAdded(): boolean {
    return this.locationSelectionService.addingLocationId$() !== null;
  }

  get hasSelection(): boolean {
    return this.locationSelectionService.hasSelection();
  }

  displayedColumns: string[] = ['select', 'name', 'address', 'contact', 'status', 'actions'];

  private businessDataService = inject(BusinessDataService);
  private locationSelectionService = inject(LocationSelectionService);
  private snackBar = inject(MatSnackBar);

  constructor(
    public dialogRef: MatDialogRef<LocationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LocationDialogData
  ) {}

  ngOnInit(): void {
    console.log('LocationDialogComponent initialized with data:', this.data);
    this.loadLocations();
  }

  private loadLocations(): void {
    console.log('Loading locations for chainId:', this.data.chainId);
    this.isLoading = true;
    this.businessDataService.selectChain(this.data.chainId);

    // Get locations from the service signal
    const locations = this.businessDataService.locations$();
    console.log('Retrieved locations:', locations);
    this.locations = locations;
    this.updateLocationStats();
    this.applyFilters();
    this.isLoading = false;
  }

  private updateLocationStats(): void {
    this.activeLocationsCount = this.locations.filter(loc => loc.isActive).length;
    this.inactiveLocationsCount = this.locations.filter(loc => !loc.isActive).length;
  }

  refreshLocations(): void {
    this.loadLocations();
  }

  copyLocationInfo(location: Location): void {
    const locationInfo = `${location.name}\n${location.address}\n${location.city}, ${location.state} ${location.postalCode}\n${location.phone || 'No phone'}\n${location.email || 'No email'}`;

    navigator.clipboard
      .writeText(locationInfo)
      .then(() => {
        this.snackBar.open(`Copied ${location.name} information to clipboard!`, 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      })
      .catch(() => {
        this.snackBar.open('Failed to copy location information', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      });
  }

  viewOnMap(location: Location): void {
    const address = `${location.address}, ${location.city}, ${location.state} ${location.postalCode}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(mapUrl, '_blank');
  }

  // Location selection and addition methods
  isLocationSelected(locationId: string): boolean {
    return this.locationSelectionService.isLocationSelected(locationId);
  }

  selectLocation(locationId: string): void {
    this.locationSelectionService.selectLocation(locationId);
  }

  clearSelection(): void {
    this.locationSelectionService.clearSelection();
  }

  async addSelectedLocation(): Promise<void> {
    const selectedId = this.locationSelectionService.getSelectedLocationId();
    if (selectedId) {
      await this.locationSelectionService.addLocationToChain(this.data.chainId, selectedId);
    }
  }

  // Search methods
  onSearchChange(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.locations];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        location =>
          location.name.toLowerCase().includes(searchLower) ||
          location.address.toLowerCase().includes(searchLower) ||
          location.city.toLowerCase().includes(searchLower) ||
          location.state.toLowerCase().includes(searchLower) ||
          (location.phone && location.phone.includes(searchLower)) ||
          (location.email && location.email.toLowerCase().includes(searchLower))
      );
    }

    this.filteredLocations = filtered;
  }
}
