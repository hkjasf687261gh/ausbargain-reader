import { Share } from "@capacitor/share";
import { IonButton, IonIcon, IonItem, IonLabel } from "@ionic/react";
import { shareSocialOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { ozBargainDealUrl } from "../../helpers/constants";
import { OzbargainDeal } from "../../types/OzbargainDeal";

type Props = {
  deal: OzbargainDeal;
  componentType: "button" | "list-item";
};

const ShareButton = ({ deal, componentType }: Props) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    Share.canShare().then((result) => {
      setCanShare(result.value);
    });
  }, []);

  function handleShareDeal() {
    Share.share({
      title: deal.title,
      text: deal.title,
      url: ozBargainDealUrl(deal.nid),
      dialogTitle: "Share with buddies",
    });
  }

  // Don't show share button if device cant share
  if (!canShare) return <></>;

  return componentType === "button" ? (
    <IonButton size="small" shape="round" onClick={handleShareDeal}>
      <IonIcon
        slot="icon-only"
        size="small"
        color="medium"
        icon={shareSocialOutline}
      />
    </IonButton>
  ) : (
    <IonItem button onClick={handleShareDeal}>
      <IonIcon icon={shareSocialOutline} slot="start" />
      <IonLabel>Share</IonLabel>
    </IonItem>
  );
};

export default ShareButton;
