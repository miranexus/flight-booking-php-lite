import { NgIf } from '@angular/common';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { EMPTY_SELECTED_CITIES } from '../../constants';
import { Component, inject, OnInit } from '@angular/core';
import { City, RouteIds, SelectedCities } from '../../types';
import { DirectionRadioButtonsComponent } from '../direction-radio-buttons/direction-radio-buttons.component';
import { NavigationService, SignalsStoreService } from '../../services';


@Component({
  standalone: true,
  selector: 'ryanair',
  imports: [
    NgIf,
    Select,
    FormsModule,
    PrimeTemplate,
    ButtonDirective,
    DirectionRadioButtonsComponent,
  ],
  templateUrl: './ryanair.component.html',
  styleUrl: './ryanair.component.scss'
})
export class RyanairComponent implements OnInit {

  private navigationService = inject(NavigationService);
  private signalsStoreService = inject(SignalsStoreService);

  cities: City[] = [
    { name: 'New York', code: 'JFK' },
    { name: 'Rome', code: 'FCO' },
    { name: 'London', code: 'LHR' },
    { name: 'Madrid', code: 'MAD' }
  ];

  selectedCities: SelectedCities = EMPTY_SELECTED_CITIES;

  ngOnInit(): void {
    this.selectedCities = this.signalsStoreService.getSelectedCities() ?? EMPTY_SELECTED_CITIES;
    if (this.cities && this.cities.length > 0) {
      this.selectedCities = {
        from: this.cities[0], // or any default city object
        to: this.cities[1] || this.cities[0] // ensure a different default if possible
      };
    }
  }

  setSelectedCityByKey(city: City, key: 'from' | 'to') {
    this.selectedCities[key] = city;
    if (this.selectedCities.from?.code === this.selectedCities.to?.code && !!this.selectedCities.from?.code) {
      this.selectedCities.to = { name: '', code: '' };
    }
    this.signalsStoreService.setSelectedCities(this.selectedCities);
  }

  switchCities() {
    [this.selectedCities.from, this.selectedCities.to] = [this.selectedCities.to, this.selectedCities.from];
    this.signalsStoreService.setSelectedCities(this.selectedCities);
  }

  saveSelections() {
    if (this.selectedCities.from?.code && this.selectedCities.to?.code) {
      this.navigationService.navigateToStep(RouteIds.pDialog);
    } else {
      alert('Please select both departure and destination cities.');
    }
  }
}
