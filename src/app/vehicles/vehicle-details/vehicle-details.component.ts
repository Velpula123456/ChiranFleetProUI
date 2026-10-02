import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { VehicleService } from '../../core/services/vehicle.service';
import { AssignmentService } from '../../core/services/assignment.service';
import { FormsModule } from '@angular/forms';

import { Vehicle } from '../../shared/models/vehicle.model';
import { UnassignVehicleRequest } from '../../shared/models/assignment.model';

@Component({
  selector: 'app-vehicle-details',
  templateUrl: './vehicle-details.component.html',
  styleUrls: ['./vehicle-details.component.scss']
})
export class VehicleDetailsComponent implements OnInit {

  vehicle: Vehicle | null = null;

  isLoading = false;
  isUnassigning = false;

  errorMessage = '';
  successMessage = '';

  showUnassignDialog = false;

  unassignReason = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {

    const vehicleId = Number(
      this.route.snapshot.paramMap.get('vehicleId')
    );

    if (!vehicleId || vehicleId <= 0) {
      this.errorMessage = 'Invalid vehicle ID.';
      return;
    }

    this.loadVehicle(vehicleId);
  }

  loadVehicle(vehicleId: number): void {

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.vehicleService
      .getVehicleById(vehicleId)
      .subscribe({

        next: vehicle => {
          this.vehicle = vehicle;
          this.isLoading = false;
        },

        error: error => {

          console.error(
            'Vehicle details error:',
            error
          );

          this.errorMessage =
            'Unable to load vehicle details.';

          this.isLoading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/vehicles']);
  }

  getStatusClass(status: string): string {

    return status
      .toLowerCase()
      .replace(/_/g, '-');
  }

  openUnassignDialog(): void {

    if (!this.vehicle) {
      return;
    }

    if (this.vehicle.vehicleStatus !== 'ASSIGNED') {
      return;
    }

    this.unassignReason = '';

    this.errorMessage = '';
    this.successMessage = '';

    this.showUnassignDialog = true;
  }

  closeUnassignDialog(): void {

    if (this.isUnassigning) {
      return;
    }

    this.showUnassignDialog = false;
    this.unassignReason = '';
  }

  confirmUnassign(): void {

    if (!this.vehicle) {
      return;
    }

    const reason = this.unassignReason.trim();

    if (!reason) {

      this.errorMessage =
        'Please provide a reason for unassigning the driver.';

      return;
    }

    const request: UnassignVehicleRequest = {
      reason: reason,
      rowVersion: this.vehicle.rowVersion
    };

    this.isUnassigning = true;

    this.errorMessage = '';
    this.successMessage = '';

    this.assignmentService
      .unassignVehicle(
        this.vehicle.vehicleID,
        request
      )
      .subscribe({

        next: response => {

  console.log(
    'Vehicle unassigned successfully:',
    response
  );

  this.isUnassigning = false;

  this.showUnassignDialog = false;

  this.unassignReason = '';

  // Redirect to Vehicles page after successful unassignment
  this.router.navigate(['/vehicles']);

},

        error: error => {

          console.error(
            'Unassign vehicle API error:',
            error
          );

          this.isUnassigning = false;

          if (error.status === 409) {

            this.errorMessage =
              error.error?.message ??
              'The vehicle was changed by another user. Please refresh and try again.';

          } else {

            this.errorMessage =
              error.error?.message ??
              'Unable to unassign the vehicle.';
          }
        }
      });
  }
}
