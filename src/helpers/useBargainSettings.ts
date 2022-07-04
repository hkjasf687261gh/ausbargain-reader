import { useContext } from "react";
import { CardSettingsContext } from "../contexts/CardSettingsContext";
import { OzbargainDeal } from "../types/OzbargainDeal";

export function useBargainSettings() {
  const { cardSettings } = useContext(CardSettingsContext);

  function trimContent(content: OzbargainDeal["content"]) {
    if (!content || cardSettings.cardDescriptionTrimLength === 0) return null;
    return content.slice(0, cardSettings.cardDescriptionTrimLength) + "...";
  }

  function formatSubmittedAt(bargain: OzbargainDeal) {
    if (!bargain.submittingDate) return "";

    return new Date(bargain.submittingDate).toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "2-digit",
    });
  }

  function formatLongSubmittedAt(bargain: OzbargainDeal) {
    if (!bargain.submittingDate) return "";
    return new Date(bargain.submittingDate).toLocaleDateString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
      weekday: "long",
      year: "numeric",
    });
  }

  return {
    trimContent,
    formatSubmittedAt,
    formatLongSubmittedAt,
    cardSettings,
  };
}
