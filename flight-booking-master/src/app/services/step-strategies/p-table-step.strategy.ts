import { Injectable } from '@angular/core';
import { StepStrategy } from './step.strategy';
import { RouteIds, Step } from '../../types';

@Injectable({
  providedIn: 'root',
})

export class PTableStepStrategy implements StepStrategy {
  private stepDefinition: Step = {
    id: RouteIds.pTable,
    title: 'p-table Step'
  };

  getStepDefinition() {
    return {
      ...this.stepDefinition
    }
  }
}

