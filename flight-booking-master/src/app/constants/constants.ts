import { RouteIds, SelectedCities } from "../types";

export const VALID_STEPS = [RouteIds.pSelect, RouteIds.pDialog, RouteIds.pTable];
export const EMPTY_SELECTED_CITIES: SelectedCities = { from: { name: '', code: '' }, to: { name: '', code: '' } };
