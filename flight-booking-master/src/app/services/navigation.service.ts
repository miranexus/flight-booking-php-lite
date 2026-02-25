import { SignalsStore } from '../store';
import { RouteIds, Step } from '../types';
import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SignalsStoreService } from './signals-store.service';
import { filter, map, mergeMap, shareReplay } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {

  private router = inject(Router);
  private signalsStore = inject(SignalsStore);
  private activatedRoute = inject(ActivatedRoute);
  private signalsStoreService = inject(SignalsStoreService);

  constructor() {
    this.prepareSubscriptionToNavigationEvents();
  }

  navigateToStep(step: RouteIds | string, callback?: () => void) {
    this.router.navigate([step], { replaceUrl: true }).then(() => callback?.());
  }

  navigateToFirstStep(callback?: () => void) {
    this.navigateToStep(this.signalsStoreService.getSelectedStep() || RouteIds.pSelect, callback);
  }

  private prepareSubscriptionToNavigationEvents() {
    this.router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap(route => route.data),
        map(data => data['step']),
        shareReplay(1),
        takeUntilDestroyed(),
      )
      .subscribe((step: Step) => {
        this.signalsStore.set({
          step: step?.id?.toString(),
          selectedCities: this.signalsStoreService.getSelectedCities(),
          selectedPrimeNgData: this.signalsStoreService.getPrimeNgData()
        });
      });
  }
}
