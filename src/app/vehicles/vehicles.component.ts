import { Component, OnInit } from '@angular/core';
import { VehicleService } from '../core/services/vehicle.service';
import { Vehicle } from '../shared/models/vehicle.model';

type VehicleTab = 'all' | 'available' | 'unavailable';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  activeTab: VehicleTab ='all';
  isLoading = false;
  errorMessage = '';

  constructor(
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  selectTab(tab: VehicleTab): void {
    this.activeTab = tab;
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading = true;
    this.errorMessage = '';

    let request$;

    switch (this.activeTab) {

      case 'available':
        request$ =
          this.vehicleService.getAvailableVehicles();
        break;

      case 'unavailable':
        request$ =
          this.vehicleService.getUnavailableVehicles();
        break;

      default:
        request$ =
          this.vehicleService.getVehicles();
        break;
    }
    request$.subscribe({
      next: response => {
        this.vehicles = response.items ?? [];
        this.isLoading = false;
      },

      error: error => {
        console.error('Vehicle API error:', error);

        this.errorMessage =
          'Unable to load vehicles. Please try again.';

        this.vehicles = [];
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return status
      .toLowerCase()
      .replace(/_/g, '-');
  }
}


