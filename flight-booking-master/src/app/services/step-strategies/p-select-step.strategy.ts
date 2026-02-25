import { Injectable } from '@angular/core';
import { StepStrategy } from './step.strategy';
import { RouteIds, Step } from '../../types';

@Injectable({
  providedIn: 'root',
})

export class PSelectStepStrategy implements StepStrategy {
  private stepDefinition: Step = {
    id: RouteIds.pSelect,
    title: 'p-select Step'
  };

  getStepDefinition() {
    return {
      ...this.stepDefinition
    }
  }
}

