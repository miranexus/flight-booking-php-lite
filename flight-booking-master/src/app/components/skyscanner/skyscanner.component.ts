import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DirectionDropdownComponent } from '../direction-dropdown/direction-dropdown.component';
import {BookingDropdownComponent} from '../booking-dropdown/booking-dropdown.component';


@Component({
  standalone: true,
  selector: 'skyscanner',
  imports: [
    FormsModule,
    DirectionDropdownComponent,
    BookingDropdownComponent,
  ],
  templateUrl: './skyscanner.component.html',
  styleUrl: './skyscanner.component.scss'
})
export class SkyscannerComponent {
}
