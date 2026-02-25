import { SignalsData } from '../types';
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";

const STORAGE_KEY = 'signalsStoreState';

function loadState(): SignalsData {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Ignore parse errors and use default
    }
  }
  return { step: '', selectedCities: { from: { name: '', code: '' }, to: { name: '', code: '' } } };
}

function saveState(data: SignalsData) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const SignalsStore = signalStore(
  withState({
    data: loadState()
  }),
  withMethods(({ data, ...store }) => ({
    set(newData: SignalsData) {
      patchState(store, { data: newData });
      saveState(newData);
    },
  }))
);
