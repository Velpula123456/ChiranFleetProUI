export interface AssignVehicleRequest {
  driverID: number;
  depotID?: number | null;
  assignmentType: string;
  reason?: string | null;
  rowVersion: string;
}

export interface AssignVehicleResponse {
  vehicleAssignmentID: number;
  vehicleID: number;
  driverID: number;
  depotID?: number | null;
  assignmentStartTime: string;
  assignmentType: string;
  isActive: boolean;
  vehicleStatus: string;
  rowVersion: string;
}
export interface UnassignVehicleRequest {
  reason: string;
  rowVersion: string;
}
