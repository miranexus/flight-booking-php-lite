import { RouteIds } from '../../types';
import { VALID_STEPS } from '../../constants';
import { RouterOutlet } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Component, inject, Injectable } from '@angular/core';
import { NavigationService, SignalsStoreService } from '../../services';

@Injectable({
  providedIn: 'root'
})

@Component({
  standalone: true,
  selector: 'mnx-step-wrapper',
  imports: [RouterOutlet, ButtonDirective],
  templateUrl: './step-wrapper.component.html',
  styleUrl: './step-wrapper.component.scss'
})
export class StepWrapperComponent {
  RouteIds = RouteIds;

  private navigationService = inject(NavigationService);
  private signalsStoreService = inject(SignalsStoreService);

  changeStep(step: RouteIds) {
    if (VALID_STEPS?.includes(step)) {
      this.navigationService.navigateToStep(step);
    }
  }

  navigateStep(direction: number) {
    const steps = VALID_STEPS;
    const index = steps?.indexOf(this.signalsStoreService.getSelectedStep() as RouteIds) + direction;
    if (index >= 0 && index < steps?.length) {
      this.navigationService.navigateToStep(steps[index]);
    }
  }
}
