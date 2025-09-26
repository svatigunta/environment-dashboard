import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BusinessInfo } from '../../models/business.model';
import { LocationDialogComponent } from '../location-dialog/location-dialog.component';

@Component({
  selector: 'app-business-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="business-grid-container">
      <!-- Header -->
      <div class="grid-header">
        <h2>Business Search Results</h2>
        <div class="results-info">
          <span class="total-count">{{ totalCount() }} results found</span>
        </div>
      </div>

      <!-- Loading Spinner -->
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading locations...</p>
        </div>
      }

      <!-- Data Table -->
      @if (!isLoading()) {
        <div class="table-container">
          <table mat-table [dataSource]="dataSource()" class="business-table">
            <!-- Chain Name Column -->
            <ng-container matColumnDef="chainName">
              <th mat-header-cell *matHeaderCellDef>Chain Name</th>
              <td mat-cell *matCellDef="let business">
                <div class="chain-info">
                  <div class="chain-name">{{ business.chainName }}</div>
                  <div class="dba-name">{{ business.dbaName }}</div>
                </div>
              </td>
            </ng-container>

            <!-- Legal Name Column -->
            <ng-container matColumnDef="legalName">
              <th mat-header-cell *matHeaderCellDef>Legal Name</th>
              <td mat-cell *matCellDef="let business">
                <div class="legal-name">{{ business.legalName }}</div>
              </td>
            </ng-container>

            <!-- Chain ID Column -->
            <ng-container matColumnDef="chainId">
              <th mat-header-cell *matHeaderCellDef>Chain ID</th>
              <td mat-cell *matCellDef="let business">
                <span class="chain-id">{{ business.chainId }}</span>
              </td>
            </ng-container>

            <!-- Address Column -->
            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Address</th>
              <td mat-cell *matCellDef="let business">
                <div class="address-info">
                  <div>{{ business.chainPhysicalAddress.addressLine1 }}</div>
                  <div>
                    {{ business.chainPhysicalAddress.city }},
                    {{ business.chainPhysicalAddress.state }}
                    {{ business.chainPhysicalAddress.postalCode }}
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Sales Organization Column -->
            <ng-container matColumnDef="salesOrg">
              <th mat-header-cell *matHeaderCellDef>Sales Organization</th>
              <td mat-cell *matCellDef="let business">
                <div class="sales-org">
                  <div class="org-name">{{ business.salesOrganizationName }}</div>
                  <div class="org-code">{{ business.salesOrganizationCode }}</div>
                </div>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let business">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="viewLocations(business)"
                  [disabled]="isLoading()"
                  matTooltip="View locations for this chain"
                >
                  <mat-icon>location_on</mat-icon>
                  View Locations
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr
              mat-row
              *matRowDef="let row; columns: displayedColumns"
              class="business-row"
              [class.selected]="selectedChainId() === row.chainId"
            ></tr>
          </table>
        </div>
      }

      <!-- No Data Message -->
      @if (!isLoading() && dataSource().length === 0) {
        <div class="no-data">
          <mat-icon>search_off</mat-icon>
          <h3>No business data found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .business-grid-container {
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .grid-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #e0e0e0;
      }

      .grid-header h2 {
        margin: 0;
        color: #333;
        font-size: 24px;
        font-weight: 500;
      }

      .results-info {
        color: #666;
        font-size: 14px;
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

      .table-container {
        overflow-x: auto;
      }

      .business-table {
        width: 100%;
        min-width: 800px;
      }

      .business-table th {
        background-color: #f5f5f5;
        font-weight: 600;
        color: #333;
        font-size: 14px;
      }

      .business-table td {
        padding: 12px 8px;
        border-bottom: 1px solid #e0e0e0;
      }

      .business-row {
        transition: background-color 0.2s ease;
      }

      .business-row:hover {
        background-color: #f8f9fa;
      }

      .business-row.selected {
        background-color: #e3f2fd;
      }

      .chain-info {
        min-width: 200px;
      }

      .chain-name {
        font-weight: 600;
        color: #1976d2;
        font-size: 14px;
      }

      .dba-name {
        color: #666;
        font-size: 12px;
        margin-top: 2px;
      }

      .legal-name {
        font-size: 13px;
        color: #333;
        max-width: 250px;
        word-wrap: break-word;
      }

      .chain-id {
        font-family: 'Courier New', monospace;
        background-color: #f0f0f0;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        color: #333;
      }

      .address-info {
        font-size: 13px;
        color: #555;
        line-height: 1.4;
      }

      .sales-org {
        min-width: 150px;
      }

      .org-name {
        font-weight: 500;
        color: #333;
        font-size: 13px;
      }

      .org-code {
        color: #666;
        font-size: 11px;
        margin-top: 2px;
      }

      .no-data {
        text-align: center;
        padding: 40px;
        color: #666;
      }

      .no-data mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        margin-bottom: 16px;
        color: #ccc;
      }

      .no-data h3 {
        margin: 0 0 8px 0;
        color: #333;
      }

      .no-data p {
        margin: 0;
        font-size: 14px;
      }

      button[mat-raised-button] {
        margin: 4px;
      }

      @media (max-width: 768px) {
        .business-grid-container {
          padding: 10px;
        }

        .grid-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
      }
    `,
  ],
})
export class BusinessGridComponent {
  dataSource = input.required<BusinessInfo[]>();
  totalCount = input.required<number>();
  isLoading = input<boolean>(false);
  selectedChainId = input<string | null>(null);

  onChainSelected = output<BusinessInfo>();

  displayedColumns: string[] = [
    'chainName',
    'legalName',
    'chainId',
    'address',
    'salesOrg',
    'actions',
  ];

  private dialog = inject(MatDialog);

  viewLocations(business: BusinessInfo): void {
    console.log('Opening locations for business:', business);
    this.onChainSelected.emit(business);

    // Open the location dialog
    const dialogRef = this.dialog.open(LocationDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: {
        business: business,
        chainId: business.chainId,
      },
      panelClass: 'location-dialog',
    });

    console.log('Dialog opened:', dialogRef);
  }
}
