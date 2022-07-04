import { Storage } from "@capacitor/storage";

const DARKMODE_KEY = "darkmode";

export const toggleDarkMode = async () => {
  const darkmode = await getDarkMode();
  await setDarkMode(!darkmode);
};

export const getDarkMode = async (): Promise<boolean> => {
  const darkMode = await Storage.get({ key: DARKMODE_KEY });
  return JSON.parse(darkMode.value || "false");
};

export const setDarkMode = async (value: boolean) => {
  await Storage.set({
    key: DARKMODE_KEY,
    value: JSON.stringify(value),
  });
};
