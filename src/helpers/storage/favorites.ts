import { Storage } from "@capacitor/storage";
import { OzbargainDeal } from "../../types/OzbargainDeal";

const FAVORITES_KEY = "favorites";

export const upsertFavorite = async (deal: OzbargainDeal) => {
  const favorites = await getFavorites();

  const alreadyAFavorite = favorites.find(
    (favDeal) => favDeal.nid === deal.nid
  );

  const updatedDeal: any = deal;
  delete updatedDeal.content;
  delete updatedDeal.comments;

  const updatedFavorites = alreadyAFavorite
    ? favorites.map((fav) => (fav.nid === updatedDeal.nid ? updatedDeal : fav))
    : [updatedDeal, ...favorites];

  await Storage.set({
    key: FAVORITES_KEY,
    value: JSON.stringify(updatedFavorites),
  });
};

export const getFavorite = async (nid: OzbargainDeal["nid"]) => {
  const favorites = await getFavorites();
  return favorites.find((deal) => deal.nid === nid);
};

export const getFavorites = async () => {
  const { value } = await Storage.get({ key: FAVORITES_KEY });
  return JSON.parse(value || "[]") as OzbargainDeal[];
};

export const removeFavorite = async (nid: OzbargainDeal["nid"]) => {
  const favorites = await getFavorites();
  const updatedFavorites = favorites.filter((deal) => deal.nid !== nid);

  await Storage.set({
    key: FAVORITES_KEY,
    value: JSON.stringify(updatedFavorites),
  });
};
