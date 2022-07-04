import { Storage } from "@capacitor/storage";
import {
  appSettingsDefaults,
  AppSettingsInterface,
} from "../../contexts/AppSettingsContext";

const APP_SETTINGS_KEY = "appSettings";

export const getAppSettings = async (): Promise<AppSettingsInterface> => {
  const appSettings = await Storage.get({ key: APP_SETTINGS_KEY });
  return JSON.parse(appSettings.value || "{}") || appSettingsDefaults;
};

export const setAppSettings = async (value: AppSettingsInterface) => {
  await Storage.set({
    key: APP_SETTINGS_KEY,
    value: JSON.stringify(value),
  });
};
