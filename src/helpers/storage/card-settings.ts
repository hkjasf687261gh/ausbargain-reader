import { Storage } from "@capacitor/storage";
import {
  settingsDefaults,
  CardSettingsInterface,
} from "../../contexts/CardSettingsContext";

const SETTINGS_KEY = "settings";

export const getSettings = async (): Promise<CardSettingsInterface> => {
  const settings = await Storage.get({ key: SETTINGS_KEY });
  return JSON.parse(settings.value || "{}") || settingsDefaults;
};

export const setSettings = async (value: CardSettingsInterface) => {
  await Storage.set({
    key: SETTINGS_KEY,
    value: JSON.stringify(value),
  });
};
