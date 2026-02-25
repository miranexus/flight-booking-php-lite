import { City } from '../../types';
import { NgIf } from '@angular/common';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { SignalsStoreService } from '../../services';
import { EMPTY_SELECTED_CITIES } from '../../constants';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'booking-dropdown',
  imports: [
    NgIf,
    PrimeTemplate,
    Select,
    FormsModule,
  ],
  templateUrl: './booking-dropdown.component.html',
  styleUrl: './booking-dropdown.component.scss'
})
export class BookingDropdownComponent {
  @ViewChild('dropdownTrigger', { read: ElementRef }) dropdownTrigger!: ElementRef;
  @Input() border = false;
  @Input() borderTopRadius = false;
  @Input() borderLeftRadius = false;
  @Input() borderRightRadius = false;
  @Input() borderBottomRadius = false;

  cities: City[] = [
    { name: 'New York', code: 'JFK' },
    { name: 'Rome', code: 'FCO' },
    { name: 'London', code: 'LHR' },
    { name: 'Madrid', code: 'MAD' }
  ];

  protected readonly selectedCities = EMPTY_SELECTED_CITIES;

  private signalsStoreService = inject(SignalsStoreService);

  setSelectedCityByKey(city: City, key: 'from' | 'to') {
    this.selectedCities[key] = city;
    if (this.selectedCities.from?.code === this.selectedCities.to?.code && !!this.selectedCities.from?.code) {
      this.selectedCities.to = { name: '', code: '' };
    }
    this.signalsStoreService.setSelectedCities(this.selectedCities);
  }

  onOverlayShow(): void {
    requestAnimationFrame(() => {
      const panelId = 'fromCity_panel';
      let overlay = document.getElementById(panelId) as HTMLElement | null;
      if (!overlay) {
        overlay = document.querySelector(
          '.p-overlay-content, .p-dropdown-panel, .p-overlaypanel'
        ) as HTMLElement | null;
      }
      const trigger = this.dropdownTrigger?.nativeElement as HTMLElement | null;
      if (!overlay || !trigger) return;
      const overlayRect = overlay.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const buffer = 8;
      overlay.classList.toggle('flipped', spaceBelow < overlayRect.height + buffer);
    });
  }
}
