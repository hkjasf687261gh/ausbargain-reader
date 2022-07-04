import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  getAppSettings as getLocalStorageAppSettings,
  setAppSettings as setLocalStorageAppSettings,
} from "../helpers/storage/app-settings";
import { StatusBar, Style } from "@capacitor/status-bar";

export interface AppSettingsInterface {
  darkmode: boolean;
  navigationType: "tabs" | "sidebar";
  navigationLabels: boolean;
  favoriteCatagories: string[];
  showAllCategories: boolean;
}

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

type IContextProps = {
  appSettings: AppSettingsInterface;
  setAppSettings: Function;
  setSingleAppSetting: (newAppSettings: Partial<AppSettingsInterface>) => void;
};

const AppSettingsContext = React.createContext({} as IContextProps);

export const appSettingsDefaults: AppSettingsInterface = {
  darkmode: false,
  navigationType: "tabs",
  navigationLabels: true,
  favoriteCatagories: [],
  showAllCategories: true,
};

const AppSettingsProvider = (props: Props) => {
  const [appSettings, setAppSettings] =
    useState<AppSettingsInterface>(appSettingsDefaults);

  useEffect(() => {
    async function init() {
      const savedAppSettings = await getLocalStorageAppSettings();

      // Merge default settings, incase new ones have been added
      const completeSettings = {
        ...appSettingsDefaults,
        ...savedAppSettings,
      };

      toggleDarkMode(completeSettings.darkmode);
      setAppSettings(completeSettings);
      debounceSaveSettings(completeSettings);
    }
    init();
    // eslint-disable-next-line
  }, []);

  const debounceSaveSettings = useDebouncedCallback(
    (settings: AppSettingsInterface) => {
      setLocalStorageAppSettings(settings);
    },
    1000
  );

  function toggleDarkMode(darkmode: boolean) {
    document.body.classList.toggle("dark", darkmode);
    document.body.classList.toggle("light", !darkmode);

    // Change native platform statusbar colour
    if ((window as unknown as any).StatusBar) {
      darkmode
        ? StatusBar.setStyle({ style: Style.Dark })
        : StatusBar.setStyle({ style: Style.Light });
    }

  }

  function setSingleAppSetting(
    newAppSettings: Partial<AppSettingsInterface> = {}
  ) {
    // Toggle Dark mode
    if (newAppSettings.darkmode !== undefined) {
      toggleDarkMode(newAppSettings.darkmode);
    }

    // Update Settings
    const updatedSettings = { ...appSettings, ...newAppSettings };
    setAppSettings(updatedSettings);
    debounceSaveSettings(updatedSettings);
  }

  return (
    <AppSettingsContext.Provider
      value={{ appSettings, setAppSettings, setSingleAppSetting }}
    >
      {props.children}
    </AppSettingsContext.Provider>
  );
};

export { AppSettingsContext, AppSettingsProvider };
