import { IonChip, IonIcon, IonLabel } from "@ionic/react";
import { addOutline, removeOutline } from "ionicons/icons";
import { CardSettingsInterface } from "../../contexts/CardSettingsContext";
import { OzbargainDeal } from "../../types/OzbargainDeal";

type Props = {
  settings: CardSettingsInterface;
  deal: OzbargainDeal;
};

const VoteChips = ({ settings, deal }: Props) => {
  return (
    <>
      <IonChip
        outline={true}
        color="success"
        style={{ justifyContent: "center" }}
      >
        {settings.cardVotesIconShow && <IonIcon icon={addOutline} />}
        <IonLabel>{deal.votePositive}</IonLabel>
      </IonChip>
      <IonChip
        outline={true}
        color="danger"
        style={{ justifyContent: "center" }}
      >
        {settings.cardVotesIconShow && <IonIcon icon={removeOutline} />}
        <IonLabel>{deal.voteNegative}</IonLabel>
      </IonChip>
    </>
  );
};

export default VoteChips;
