import { Injectable } from '@angular/core';
import { StepStrategy } from './step.strategy';
import { RouteIds, Step } from '../../types';

@Injectable({
  providedIn: 'root',
})

export class PDialogStepStrategy implements StepStrategy {
  private stepDefinition: Step = {
    id: RouteIds.pDialog,
    title: 'p-dialog Step'
  };

  getStepDefinition() {
    return {
      ...this.stepDefinition
    }
  }
}

