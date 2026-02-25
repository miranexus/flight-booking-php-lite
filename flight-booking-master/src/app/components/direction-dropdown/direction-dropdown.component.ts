import { Select } from 'primeng/select';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { PrimeTemplate } from 'primeng/api';


@Component({
  standalone: true,
  selector: 'direction-dropdown',
  imports: [
    NgIf,
    Select,
    NgClass,
    FormsModule,
    PrimeTemplate,
  ],
  templateUrl: './direction-dropdown.component.html',
  styleUrl: './direction-dropdown.component.scss'
})
export class DirectionDropdownComponent {

  direction = [
    { name: 'One way',},
    { name: 'Return' }
  ];

  selectedDirection = this.direction[1];

}
