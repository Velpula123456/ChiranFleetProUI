import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { DriversComponent } from './drivers/drivers.component';
import { AssignmentComponent } from './operations/assignment/assignment.component';
import { VehicleDetailsComponent } from './vehicles/vehicle-details/vehicle-details.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    component: DashboardComponent
  },

  {
    path: 'vehicles',
    component: VehiclesComponent
  },

  {
    path: 'vehicles/:vehicleId',
    component: VehicleDetailsComponent
  },

  {
    path: 'drivers',
    component: DriversComponent
  },

  {
    path: 'assignment',
    component: AssignmentComponent
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
