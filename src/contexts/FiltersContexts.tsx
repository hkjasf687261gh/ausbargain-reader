import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  getFilters as getLocalStorageFilters,
  setFilters as setLocalStorageFilters,
} from "../helpers/storage/filters";

export interface FiltersInterface {
  showFreebies: boolean;
  showExpired: boolean;
  hideCategories: string[];
  excludeWords: string[];
  highlightWords: string[];
  // showViewed: boolean;
}

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

type IContextProps = {
  filters: FiltersInterface;
  setFilters: Function;
  setSingleFilter: Function;
};

const FiltersContext = React.createContext({} as IContextProps);

export const filtersDefaults: FiltersInterface = {
  showExpired: true,
  showFreebies: true,
  hideCategories: [],
  excludeWords: [],
  highlightWords: [],
  // showViewed: true,
};

const FiltersProvider = (props: Props) => {
  const [filters, setFilters] = useState<FiltersInterface>(filtersDefaults);

  useEffect(() => {
    async function init() {
      const savedFilters = await getLocalStorageFilters();

      // Merge default settings, incase new ones have been added
      const completeSettings = {
        ...filtersDefaults,
        ...savedFilters,
      };

      setFilters(completeSettings);
      debounceSaveSettings(completeSettings);
    }
    init();
    // eslint-disable-next-line
  }, []);

  const debounceSaveSettings = useDebouncedCallback(
    (filters: FiltersInterface) => {
      setLocalStorageFilters(filters);
    },
    1000
  );

  function setSingleFilter(newFilters: Partial<FiltersInterface> = {}) {
    const updatedSettings = { ...filters, ...newFilters };
    setFilters(updatedSettings);
    debounceSaveSettings(updatedSettings);
  }

  return (
    <FiltersContext.Provider value={{ filters, setFilters, setSingleFilter }}>
      {props.children}
    </FiltersContext.Provider>
  );
};

export { FiltersContext, FiltersProvider };
