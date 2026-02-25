import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { pTableStepRoute } from './components/steps/p-table-step/p-table-step.definition';
import { pDialogStepRoute } from './components/steps/p-dialog-step/p-dialog-step.definition';
import { pSelectStepRoute } from './components/steps/p-select-step/p-select-step.definition';

export const routes: Routes = [] = [
  {
    path: '',
    component: AppComponent
  },
  pSelectStepRoute,
  pDialogStepRoute,
  pTableStepRoute
]
