import React, { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  setSettings as setLocalStorageSettings,
  getSettings as getLocalStorageSettings,
} from "../helpers/storage/card-settings";

export interface CardSettingsInterface {
  cardDescriptionTrimLength: number;
  cardTitleSize: number;
  cardContentSize: number;
  cardVotesIconShow: boolean;
  cardVotesAlignment: "right" | "bottom";
  cardCategoryShow: boolean;
  cardImageHeight: number;
  cardSubmittedDateShow: boolean;
  cardCommentCountShow: boolean;
  cardDomainUrlShow: boolean;
  cardDealPosterNameShow: boolean;
  showDateDividers: boolean;
  darkenViewedDeals: boolean;
  darkenViewedDealsOpacity: number;
  expiryDate: boolean;
  freebie: boolean;
  groupSubtitle: boolean;
  groupVotes: boolean;
  groupContent: boolean;
  highlightColor: "green" | "red" | "yellow" | "blue";
}

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

type IContextProps = {
  cardSettings: CardSettingsInterface;
  setCardSettings: Function;
  setSingleCardSetting: Function;
};

const CardSettingsContext = React.createContext({} as IContextProps);

export const settingsDefaults: CardSettingsInterface = {
  cardDescriptionTrimLength: 150, //characters
  cardTitleSize: 20,
  cardContentSize: 12,
  cardVotesIconShow: true,
  cardImageHeight: 200,
  cardCategoryShow: true,
  cardCommentCountShow: true,
  cardSubmittedDateShow: false,
  cardDomainUrlShow: false,
  cardDealPosterNameShow: false,
  showDateDividers: true,
  darkenViewedDeals: true,
  darkenViewedDealsOpacity: 0.3,
  cardVotesAlignment: "right",
  expiryDate: true,
  freebie: true,
  groupSubtitle: true,
  groupVotes: true,
  groupContent: true,
  highlightColor: "green",
};

const CardSettingsProvider = (props: Props) => {
  const [cardSettings, setCardSettings] =
    useState<CardSettingsInterface>(settingsDefaults);

  useEffect(() => {
    async function init() {
      const savedSettings = await getLocalStorageSettings();

      // Merge default settings, incase new ones have been added
      const completeSettings = {
        ...settingsDefaults,
        ...savedSettings,
      };

      setCardSettings(completeSettings);
      debounceSaveSettings(completeSettings);
    }
    init();
    // eslint-disable-next-line
  }, []);

  const debounceSaveSettings = useDebouncedCallback(
    (settings: CardSettingsInterface) => {
      setLocalStorageSettings(settings);
    },
    1000
  );

  function setSingleCardSetting(
    newSetting: Partial<CardSettingsInterface> = {}
  ) {
    const updatedSettings = { ...cardSettings, ...newSetting };
    setCardSettings(updatedSettings);
    debounceSaveSettings(updatedSettings);
  }

  return (
    <CardSettingsContext.Provider
      value={{ cardSettings, setCardSettings, setSingleCardSetting }}
    >
      {props.children}
    </CardSettingsContext.Provider>
  );
};

export { CardSettingsContext, CardSettingsProvider };
