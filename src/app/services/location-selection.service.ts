import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface AddLocationRequest {
  chainId: string;
  locationId: string;
}

export interface AddLocationResponse {
  success: boolean;
  message: string;
  locationId: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocationSelectionService {
  private selectedLocationId = signal<string | null>(null);
  private addingLocationId = signal<string | null>(null);
  private lastAddedLocationId = signal<string | null>(null);

  // Public observables
  public selectedLocationId$ = computed(() => this.selectedLocationId());
  public addingLocationId$ = computed(() => this.addingLocationId());
  public lastAddedLocationId$ = computed(() => this.lastAddedLocationId());

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Select a location
   */
  selectLocation(locationId: string): void {
    this.selectedLocationId.set(locationId);
  }

  /**
   * Check if a location is selected
   */
  isLocationSelected(locationId: string): boolean {
    return this.selectedLocationId() === locationId;
  }

  /**
   * Get the selected location ID
   */
  getSelectedLocationId(): string | null {
    return this.selectedLocationId();
  }

  /**
   * Check if any location is selected
   */
  hasSelection(): boolean {
    return this.selectedLocationId() !== null;
  }

  /**
   * Check if a location is currently being added
   */
  isLocationBeingAdded(locationId: string): boolean {
    return this.addingLocationId() === locationId;
  }

  /**
   * Check if any location is being added
   */
  isAnyLocationBeingAdded(): boolean {
    return this.addingLocationId() !== null;
  }

  /**
   * Add a single location to a chain via server call
   */
  async addLocationToChain(chainId: string, locationId: string): Promise<AddLocationResponse> {
    this.addingLocationId.set(locationId);

    try {
      const request: AddLocationRequest = {
        chainId: chainId,
        locationId: locationId,
      };

      // Simulate server call - replace with actual HTTP call
      const response = await this.simulateAddLocationCall(request);

      if (response.success) {
        this.snackBar.open(`Successfully added location to chain`, 'Close', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });

        this.lastAddedLocationId.set(locationId);
      } else {
        this.snackBar.open(`Failed to add location: ${response.message}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }

      return response;
    } catch (error) {
      console.error('Error adding location:', error);
      this.snackBar.open('Error occurred while adding location', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      return {
        success: false,
        message: 'Error occurred while adding location',
        locationId: locationId,
      };
    } finally {
      this.addingLocationId.set(null);
    }
  }

  /**
   * Simulate server call - replace with actual HTTP implementation
   */
  private simulateAddLocationCall(request: AddLocationRequest): Promise<AddLocationResponse> {
    return new Promise(resolve => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate success/failure (for demo purposes)
        const successRate = 0.8; // 80% success rate
        const isSuccess = Math.random() < successRate;

        const response: AddLocationResponse = {
          success: isSuccess,
          message: isSuccess
            ? `Location added successfully`
            : 'Failed to add location (simulated error)',
          locationId: request.locationId,
        };

        resolve(response);
      }, 1500); // 1.5 second delay to simulate network call
    });
  }

  /**
   * Actual HTTP implementation (uncomment and modify as needed)
   */
  /*
  private addLocationToChain(request: AddLocationRequest): Observable<AddLocationResponse> {
    return this.http.post<AddLocationResponse>('/api/chains/location/add', request)
      .pipe(
        catchError(error => {
          console.error('HTTP Error:', error);
          return of({
            success: false,
            message: 'Network error occurred',
            locationId: request.locationId
          });
        })
      );
  }
  */

  /**
   * Clear selection
   */
  clearSelection(): void {
    this.selectedLocationId.set(null);
  }

  /**
   * Reset service state
   */
  reset(): void {
    this.selectedLocationId.set(null);
    this.addingLocationId.set(null);
    this.lastAddedLocationId.set(null);
  }
}
