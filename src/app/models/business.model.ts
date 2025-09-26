export interface ChainPhysicalAddress {
  addressType: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  postalCodeExtension: string;
  country: string;
}

export interface BusinessInfo {
  rowNumber: string;
  salesOrganizationCode: string;
  salesOrganizationName: string;
  salesChannelCode: string;
  salesChannelName: string;
  partnerId: string;
  partnerName: string;
  partnerGroupId: string;
  partnerGroupName: string;
  superChainId: string;
  superChainName: string;
  chainId: string;
  chainEntityId: string;
  chainName: string;
  dbaName: string;
  legalName: string;
  federalTaxId: string;
  chainPhysicalAddress: ChainPhysicalAddress;
}

export interface BusinessSearchResult {
  totalRowCount: string;
  totalReturnedCount: string;
  businessInfo: BusinessInfo[];
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone?: string;
  email?: string;
  isActive: boolean;
}
