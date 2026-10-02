import { Component, OnInit } from '@angular/core';

import { VehicleService } from '../../core/services/vehicle.service';
import { DriverService } from '../../core/services/driver.service';
import { AssignmentService } from '../../core/services/assignment.service';

import { Vehicle } from '../../shared/models/vehicle.model';
import { Driver } from '../../shared/models/driver.model';
import {
  AssignVehicleRequest,
  AssignVehicleResponse
} from '../../shared/models/assignment.model';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.scss']
})
export class AssignmentComponent implements OnInit {

  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];

  selectedVehicle: Vehicle | null = null;
  selectedDriver: Driver | null = null;

  isLoadingVehicles = false;
  isLoadingDrivers = false;
  isAssigning = false;

  errorMessage = '';
  successMessage = '';

  constructor(
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {
    this.loadAvailableVehicles();
    this.loadAvailableDrivers();
  }

  loadAvailableVehicles(): void {
    this.isLoadingVehicles = true;
    this.errorMessage = '';

    this.vehicleService.getAvailableVehicles().subscribe({
      next: response => {
        this.vehicles = response.items ?? [];
        this.isLoadingVehicles = false;
      },
      error: error => {
        console.error('Available vehicles API error:', error);
        this.errorMessage = 'Unable to load available vehicles.';
        this.isLoadingVehicles = false;
      }
    });
  }

  loadAvailableDrivers(): void {
    this.isLoadingDrivers = true;

    this.driverService.getAvailableDrivers().subscribe({
      next: response => {
        this.drivers = response.items ?? [];
        this.isLoadingDrivers = false;
      },
      error: error => {
        console.error('Available drivers API error:', error);
        this.errorMessage = 'Unable to load available drivers.';
        this.isLoadingDrivers = false;
      }
    });
  }

  selectVehicle(vehicle: Vehicle): void {
    this.selectedVehicle = vehicle;
    this.successMessage = '';
    this.errorMessage = '';
  }

  selectDriver(driver: Driver): void {
    this.selectedDriver = driver;
    this.successMessage = '';
    this.errorMessage = '';
  }

  getDriverName(driver: Driver): string {
    return [
      driver.firstName,
      driver.middleName,
      driver.lastName
    ]
      .filter(value => value)
      .join(' ');
  }

  canAssign(): boolean {
    return !!this.selectedVehicle &&
           !!this.selectedDriver &&
           !this.isAssigning;
  }

  assignVehicle(): void {

    if (!this.selectedVehicle || !this.selectedDriver) {
      this.errorMessage = 'Please select both vehicle and driver.';
      return;
    }

    const request: AssignVehicleRequest = {
      driverID: this.selectedDriver.driverID,
      depotID: null,
      assignmentType: 'DRIVER',
      reason: 'Normal vehicle assignment',
      rowVersion: this.selectedVehicle.rowVersion
    };

    this.isAssigning = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.assignmentService
      .assignVehicle(this.selectedVehicle.vehicleID, request)
      .subscribe({
        next: (response: AssignVehicleResponse) => {

          console.log('Vehicle assigned successfully:', response);

          this.successMessage =
            `${this.selectedVehicle?.fleetNumber} has been assigned successfully.`;

          this.isAssigning = false;

          this.selectedVehicle = null;
          this.selectedDriver = null;

          this.loadAvailableVehicles();
          this.loadAvailableDrivers();
        },

        error: error => {

          console.error('Assign vehicle API error:', error);

          if (error.status === 409) {
            this.errorMessage =
              error.error?.message ??
              'Vehicle or driver is no longer available. Please refresh and try again.';
          } else {
            this.errorMessage =
              error.error?.message ??
              'Unable to assign vehicle.';
          }

          this.isAssigning = false;

          this.loadAvailableVehicles();
          this.loadAvailableDrivers();
        }
      });
  }
}
