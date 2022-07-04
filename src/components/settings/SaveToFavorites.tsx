import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import {
  upsertFavorite,
  getFavorite,
  removeFavorite,
} from "../../helpers/storage/favorites";
import { OzbargainDeal } from "../../types/OzbargainDeal";

type Props = {
  deal: OzbargainDeal;
  componentType: "button" | "list-item";
};

const SaveToFavorites = ({ deal, componentType }: Props) => {
  const [isFavorite, setIsFavorite] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    async function checkIfFavorite() {
      const fav = await getFavorite(deal.nid);
      setIsFavorite(!!fav);

      // Update the saved deal
      if (fav) upsertFavorite(deal);
    }

    if (isFavorite === undefined) {
      checkIfFavorite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  function handleFavoriteButton() {
    if (!deal) return;

    if (isFavorite) {
      setIsFavorite(false);
      removeFavorite(deal.nid);
    } else {
      setIsFavorite(true);
      upsertFavorite(deal);
    }
  }

  const wording = isFavorite ? "Remove Favorite" : "Save Favorite";
  const icon = isFavorite ? star : starOutline;

  return componentType === "button" ? (
    <IonButton size="small" shape="round" onClick={handleFavoriteButton}>
      <IonIcon slot="icon-only" color="medium" icon={icon} size="small" />
    </IonButton>
  ) : (
    <IonItem button onClick={handleFavoriteButton}>
      <IonIcon icon={icon} slot="start" />
      <IonLabel>{wording}</IonLabel>
    </IonItem>
  );
};

export default SaveToFavorites;
