import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { RouteIds } from '../../../types';
import { PDialogStepComponent } from './p-dialog-step.component';
import { StepResolverService } from '../../../services';

export const pDialogStepRoute: Route = {
  path: RouteIds.pDialog,
  resolve: {step: () => inject(StepResolverService).resolve(RouteIds.pDialog) },
  canActivate: [],
  component: PDialogStepComponent
}
