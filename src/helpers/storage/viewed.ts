import { Storage } from "@capacitor/storage";
import { OzbargainDeal } from "../../types/OzbargainDeal";

const VIEWED_KEY = "v";

export function convertDateToKey(date: Date) {
  return `${VIEWED_KEY}_${date.toLocaleDateString("en-au", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })}`;
}

export const dealHasBeenViewed = async (
  deal: OzbargainDeal
): Promise<boolean> => {
  if (!deal.submittingDate) return false;
  const dateNidsJson = await Storage.get({
    key: convertDateToKey(deal.submittingDate),
  });
  const dateNids = JSON.parse(dateNidsJson.value || "[]") || [];
  return dateNids.includes(deal.nid);
};

export const getByStorageKey = async (
  key: string
): Promise<OzbargainDeal["nid"][]> => {
  const dateNids = await Storage.get({ key: key });
  return JSON.parse(dateNids.value || "[]") || [];
};

export const getDateViewedItems = async (
  date: Date
): Promise<OzbargainDeal["nid"][]> => {
  const dateNids = await Storage.get({ key: convertDateToKey(date) });
  return JSON.parse(dateNids.value || "[]") || [];
};

export const setDateViewedItem = async (
  date: Date,
  dealNid: OzbargainDeal["nid"]
) => {
  const current = await getDateViewedItems(date);
  if (current.includes(dealNid)) return;

  await Storage.set({
    key: convertDateToKey(date),
    value: JSON.stringify([...current, dealNid]),
  });
};
