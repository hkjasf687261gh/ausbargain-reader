import { Storage } from "@capacitor/storage";
import {
  filtersDefaults,
  FiltersInterface,
} from "../../contexts/FiltersContexts";

const FILTERS_KEY = "filters";

export const getFilters = async (): Promise<FiltersInterface> => {
  const filters = await Storage.get({ key: FILTERS_KEY });
  return JSON.parse(filters.value || "{}") || filtersDefaults;
};

export const setFilters = async (value: FiltersInterface) => {
  await Storage.set({
    key: FILTERS_KEY,
    value: JSON.stringify(value),
  });
};
