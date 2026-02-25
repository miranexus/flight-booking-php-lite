import { RyanairComponent } from '../../ryanair/ryanair.component';
import { SkyscannerComponent } from '../../skyscanner/skyscanner.component';
import { Component, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

@Component({
  standalone: true,
  selector: 'mnx-p-select-step',
  imports: [RyanairComponent, SkyscannerComponent],
  templateUrl: './p-select-step.component.html',
  styleUrls: ['./p-select-step.component.scss'],
})

export class PSelectStepComponent {}
