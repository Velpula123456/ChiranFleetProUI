export interface Vehicle {
  vehicleID: number;
  fleetNumber: string;
  registrationNumber: string;
  vin: string;
  vehicleStatus: string;
  currentOdometerKm: number;
  isActive: boolean;
  rowVersion: string;
  vehicleModel: string;
  manufacturer: string;
  depot: string;
}
