import _ from "lodash";
import { FiltersInterface } from "../contexts/FiltersContexts";
import { OzbargainDeal } from "../types/OzbargainDeal";
import { convertDateToKey, getByStorageKey } from "./storage/viewed";

export async function applyFilters(
  deals: OzbargainDeal[],
  filters: FiltersInterface
) {
  // Filter Deals
  const updatedDeals = deals.filter((deal) => {
    if (deal.expiredTag && !filters.showExpired) return false;
    if (deal.isFreebie && !filters.showFreebies) return false;

    // Excluded Category
    if (
      filters.hideCategories.length > 0 &&
      _.intersection(
        filters.hideCategories,
        deal.tags.map((tag) => tag.name)
      ).length > 0
    )
      return false;

    // Ecluded Word
    if (filters.excludeWords.length > 0) {
      const hasExcludedWord = filters.excludeWords.some((word: string) =>
        deal.title.toLowerCase().includes(word.toLowerCase())
      );
      if (hasExcludedWord) return false;
    }

    return true;
  });

  // Cache the viewed values
  let viewedStorage: { [index: string]: string[] } = {};
  const dateKeys = deals
    .map((deal) =>
      deal.submittingDate ? convertDateToKey(deal.submittingDate) : null
    )
    .filter((dateKey) => dateKey !== null);

  const uniqueKeys = _.uniq(dateKeys);

  for (let index = 0; index < uniqueKeys.length; index++) {
    const storageKey = uniqueKeys[index];

    if (storageKey) {
      viewedStorage[storageKey] = await getByStorageKey(storageKey);
    }
  }

  // Set Viewed
  updatedDeals.forEach((deal) => {
    // Mark as viewed
    if (deal.submittingDate) {
      const dateKey = convertDateToKey(deal.submittingDate);
      const beenViewied = viewedStorage[dateKey].includes(deal.nid);
      deal.viewed = beenViewied;
    }

    // Highlight Deal
    if (filters.highlightWords.length > 0) {
      deal.highlighted = filters.highlightWords.some((word) =>
        deal.title.toLowerCase().includes(word.toLowerCase())
      );
    }

    return deal;
  });

  return updatedDeals;
}
