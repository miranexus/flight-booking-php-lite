import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { RouteIds } from '../../../types';
import { StepResolverService } from '../../../services';
import { PSelectStepComponent } from './p-select-step.component';

export const pSelectStepRoute: Route = {
  path: RouteIds.pSelect,
  resolve: {step: () => inject(StepResolverService).resolve(RouteIds.pSelect) },
  canActivate: [],
  component: PSelectStepComponent
}
