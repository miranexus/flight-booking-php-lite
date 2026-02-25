import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PrimeNgData } from '../../../models';
import { DropdownModule } from 'primeng/dropdown';
import { Component, inject, Injectable, OnInit } from '@angular/core';
import { PrimeNgDataService, SignalsStoreService } from '../../../services';

@Injectable({
  providedIn: 'root'
})

@Component({
  standalone: true,
  imports: [
    FormsModule,
    DropdownModule,
    TableModule
  ],
  selector: 'mnx-p-table-step',
  templateUrl: './p-table-step.component.html',
  styleUrls: ['./p-table-step.component.scss'],
})

export class PTableStepComponent implements OnInit {
  message = '';
  primeNgData: PrimeNgData[] = [];

  private primeNgDataService = inject(PrimeNgDataService);
  private signalsStoreService = inject(SignalsStoreService);

  ngOnInit(): void {
    this.primeNgData = this.signalsStoreService.getPrimeNgData() || [];
    if (this.primeNgData.length === 0) {
      this.retrievePrimeNgData();
    }
  }

  private retrievePrimeNgData(): void {
    this.primeNgDataService.getAll().subscribe({
      next: (data) => {
        this.primeNgData = data;
        this.signalsStoreService.setPrimeNgData(data);
        console.log('Fetched all data:', this.primeNgData);
      },
      error: (e) => console.error(e)
    });
  }

  updatePrimeNgData(id: number): void {
    const index = this.primeNgData.findIndex(row => row.id === id);
    if (index === -1) return;
    const item = this.primeNgData[index];
    this.message = '';
    this.primeNgDataService.update(id, item).subscribe({
      next: (res) => {
        console.log('Updated Item', res);
        if (res?.data) {
          this.primeNgData[index] = res.data;
        }
        this.signalsStoreService.setPrimeNgData(this.primeNgData);
        this.message = res?.message || 'This tutorial was updated successfully!';
      },
      error: (e) => console.error(e)
    });
  }

  deletePrimeNgData(id: number): void {
    const index = this.primeNgData.findIndex(row => row.id === id);
    if (index === -1) return;
    this.primeNgDataService.delete(id).subscribe({
      next: (res) => {
        console.log('Deleted Item', res);
        this.primeNgData.splice(index, 1);
        this.signalsStoreService.setPrimeNgData(this.primeNgData);
        this.message = res?.message || 'Item was deleted successfully!';
      },
      error: (e) => console.error(e)
    });
  }
}
