import { NavigationService } from './services';
import { StepWrapperComponent } from './components/step-wrapper/step-wrapper.component';
import { Component, Injectable, OnInit } from '@angular/core';


@Injectable({
  providedIn: 'root'
})

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [StepWrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent implements OnInit {

  constructor(
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.navigationService.navigateToFirstStep();
  }
}
