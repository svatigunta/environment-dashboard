import { Injectable, computed, signal } from '@angular/core';
import { Observable, delay, of } from 'rxjs';
import { BusinessInfo, BusinessSearchResult, Location } from '../models/business.model';

@Injectable({
  providedIn: 'root',
})
export class BusinessDataService {
  private businessData = signal<BusinessInfo[]>([]);
  private selectedChainId = signal<string | null>(null);
  private locations = signal<Location[]>([]);
  private isLoading = signal<boolean>(false);

  // Public observables
  public businessData$ = computed(() => this.businessData());
  public selectedChainId$ = computed(() => this.selectedChainId());
  public locations$ = computed(() => this.locations());
  public isLoading$ = computed(() => this.isLoading());

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load the data from the JSON file
    const mockData: BusinessSearchResult = {
      totalRowCount: '3',
      totalReturnedCount: '3',
      businessInfo: [
        {
          rowNumber: '1',
          salesOrganizationCode: 'GLXCO',
          salesOrganizationName: 'Galaxy Corp',
          salesChannelCode: 'GLXWEB',
          salesChannelName: 'Galaxy Web Sales',
          partnerId: 'PARGLX1',
          partnerName: 'Galaxy Corp',
          partnerGroupId: 'GLXGRP2025001',
          partnerGroupName: 'GLXGRP2025001',
          superChainId: 'S000001234',
          superChainName: "ORION'S BELT BISTROS",
          chainId: 'OBB555',
          chainEntityId: '987654321',
          chainName: "Orion's Belt Cafe",
          dbaName: "Orion's Belt Cafe",
          legalName: "ORION'S BELT BISTROS LLC",
          federalTaxId: '123456789',
          chainPhysicalAddress: {
            addressType: 'Physical Address',
            addressLine1: '123 Starburst Lane',
            city: 'Cosmos',
            state: 'CA',
            postalCode: '90210',
            postalCodeExtension: '1111',
            country: '01',
          },
        },
        {
          rowNumber: '2',
          salesOrganizationCode: 'SUNFL',
          salesOrganizationName: 'Sunflower Foods',
          salesChannelCode: 'SUNFLRET',
          salesChannelName: 'Sunflower Retail',
          partnerId: 'PARSUN1',
          partnerName: 'Sunflower Foods',
          partnerGroupId: 'SUNGRP2025002',
          partnerGroupName: 'SUNGRP2025002',
          superChainId: 'S000005678',
          superChainName: 'GARDEN FRESH MARKETS',
          chainId: 'GFM888',
          chainEntityId: '876543210',
          chainName: 'Garden Fresh Grocers',
          dbaName: 'Garden Fresh Grocers',
          legalName: 'GARDEN FRESH MARKETS INC',
          federalTaxId: '987654321',
          chainPhysicalAddress: {
            addressType: 'Physical Address',
            addressLine1: '456 Meadowbrook Dr',
            city: 'Springfield',
            state: 'IL',
            postalCode: '62704',
            postalCodeExtension: '2222',
            country: '01',
          },
        },
        {
          rowNumber: '3',
          salesOrganizationCode: 'AQUATEC',
          salesOrganizationName: 'AquaTech Solutions',
          salesChannelCode: 'AQUAB2B',
          salesChannelName: 'AquaTech B2B',
          partnerId: 'PARAQUA1',
          partnerName: 'AquaTech Solutions',
          partnerGroupId: 'AQUAGRP2025003',
          partnerGroupName: 'AQUAGRP2025003',
          superChainId: 'S000009101',
          superChainName: 'OCEANIC GEAR SUPPLY',
          chainId: 'OGS999',
          chainEntityId: '765432109',
          chainName: 'Oceanic Dive Shop',
          dbaName: 'Oceanic Dive Shop',
          legalName: 'OCEANIC GEAR SUPPLY CO',
          federalTaxId: '555444333',
          chainPhysicalAddress: {
            addressType: 'Physical Address',
            addressLine1: '789 Coral Reef Rd',
            city: 'Key West',
            state: 'FL',
            postalCode: '33040',
            postalCodeExtension: '3333',
            country: '01',
          },
        },
      ],
    };

    this.businessData.set(mockData.businessInfo);
  }

  getBusinessData(): BusinessInfo[] {
    return this.businessData();
  }

  selectChain(chainId: string): void {
    this.selectedChainId.set(chainId);
    this.fetchLocationsForChain(chainId);
  }

  private fetchLocationsForChain(chainId: string): void {
    this.isLoading.set(true);

    // Simulate API call with mock data
    this.getMockLocations(chainId).subscribe(locations => {
      this.locations.set(locations);
      this.isLoading.set(false);
    });
  }

  private getMockLocations(chainId: string): Observable<Location[]> {
    // Mock location data based on chain ID
    const mockLocations: { [key: string]: Location[] } = {
      OBB555: [
        {
          id: 'LOC001',
          name: "Orion's Belt Cafe - Downtown",
          address: '123 Starburst Lane',
          city: 'Cosmos',
          state: 'CA',
          postalCode: '90210',
          phone: '(555) 123-4567',
          email: 'downtown@orionsbelt.com',
          isActive: true,
        },
        {
          id: 'LOC002',
          name: "Orion's Belt Cafe - Uptown",
          address: '456 Galaxy Blvd',
          city: 'Cosmos',
          state: 'CA',
          postalCode: '90211',
          phone: '(555) 123-4568',
          email: 'uptown@orionsbelt.com',
          isActive: true,
        },
        {
          id: 'LOC003',
          name: "Orion's Belt Cafe - Airport",
          address: '789 Terminal Way',
          city: 'Cosmos',
          state: 'CA',
          postalCode: '90212',
          phone: '(555) 123-4569',
          email: 'airport@orionsbelt.com',
          isActive: false,
        },
      ],
      GFM888: [
        {
          id: 'LOC004',
          name: 'Garden Fresh Grocers - Main Store',
          address: '456 Meadowbrook Dr',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62704',
          phone: '(555) 234-5678',
          email: 'main@gardenfresh.com',
          isActive: true,
        },
        {
          id: 'LOC005',
          name: 'Garden Fresh Grocers - Westside',
          address: '789 Green Valley Rd',
          city: 'Springfield',
          state: 'IL',
          postalCode: '62705',
          phone: '(555) 234-5679',
          email: 'westside@gardenfresh.com',
          isActive: true,
        },
      ],
      OGS999: [
        {
          id: 'LOC006',
          name: 'Oceanic Dive Shop - Key West',
          address: '789 Coral Reef Rd',
          city: 'Key West',
          state: 'FL',
          postalCode: '33040',
          phone: '(555) 345-6789',
          email: 'keywest@oceanicgear.com',
          isActive: true,
        },
        {
          id: 'LOC007',
          name: 'Oceanic Dive Shop - Miami',
          address: '321 Ocean Drive',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101',
          phone: '(555) 345-6790',
          email: 'miami@oceanicgear.com',
          isActive: true,
        },
        {
          id: 'LOC008',
          name: 'Oceanic Dive Shop - Tampa',
          address: '654 Gulf Blvd',
          city: 'Tampa',
          state: 'FL',
          postalCode: '33602',
          phone: '(555) 345-6791',
          email: 'tampa@oceanicgear.com',
          isActive: true,
        },
      ],
    };

    return of(mockLocations[chainId] || []).pipe(delay(1000)); // Simulate network delay
  }

  clearSelection(): void {
    this.selectedChainId.set(null);
    this.locations.set([]);
  }

  getSelectedChain(): BusinessInfo | null {
    const chainId = this.selectedChainId();
    if (!chainId) return null;

    return this.businessData().find(business => business.chainId === chainId) || null;
  }
}
