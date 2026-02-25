import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';


@Component({
  standalone: true,
  selector: 'direction-radio-buttons',
  imports: [
    FormsModule,
    RadioButton,
  ],
  templateUrl: './direction-radio-buttons.component.html',
  styleUrl: './direction-radio-buttons.component.scss'
})
export class DirectionRadioButtonsComponent {
  tripType: string = 'return';
}
