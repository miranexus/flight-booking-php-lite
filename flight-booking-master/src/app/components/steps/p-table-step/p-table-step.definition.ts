import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { RouteIds } from '../../../types';
import { StepResolverService } from '../../../services';
import { PTableStepComponent } from './p-table-step.component';

export const pTableStepRoute: Route = {
  path: RouteIds.pTable,
  resolve: {step: () => inject(StepResolverService).resolve(RouteIds.pTable) },
  canActivate: [],
  component: PTableStepComponent
}
