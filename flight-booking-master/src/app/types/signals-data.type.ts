import { PrimeNgData } from '../models';

export interface SignalsData {
  step: string;
  selectedCities?: SelectedCities;
  selectedPrimeNgData?: PrimeNgData[];
}

export interface SelectedCities {
  from: City | undefined;
  to: City | undefined;
}

export interface City {
  name: string | undefined;
  code?: string | undefined;
}
