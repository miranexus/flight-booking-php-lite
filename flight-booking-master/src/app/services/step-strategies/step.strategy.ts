import { Step } from '../../types';

export interface StepStrategy {
  getStepDefinition(): Step;
}
