import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { AfterViewInit, Component, inject } from '@angular/core';
import { PrimeNgDataService, SignalsStoreService } from '../../../services';

@Component({
  standalone: true,
  imports: [
    DropdownModule,
    Button,
    Dialog,
    InputText,
    FormsModule
  ],
  selector: 'mnx-p-dialog-step',
  templateUrl: './p-dialog-step.component.html',
  styleUrls: ['./p-dialog-step.component.scss'],
})

export class PDialogStepComponent implements AfterViewInit {
  visible = false;
  title: string = '';
  description: string = '';

  private primeNgDataService = inject(PrimeNgDataService);
  private signalsStoreService = inject(SignalsStoreService);

  ngAfterViewInit(): void {
    this.visible = false;
  }

  showDialog() {
    this.visible = true;
  }

  addPrimeNgDataItem() {
    this.primeNgDataService.create({
      title: this.title,
      description: this.description
    }).subscribe({
      next: res => {
        const current = this.signalsStoreService.getPrimeNgData(); // get current array
        this.signalsStoreService.setPrimeNgData([...(current || []), res]); // add new item
        this.visible = false;
      },
      error: console.error
    });
  }
}
