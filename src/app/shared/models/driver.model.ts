export interface Driver {
  driverID: number;
  driverCode: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneNumber?: string | null;
  driverStatus: string;
  isActive: boolean;
}
