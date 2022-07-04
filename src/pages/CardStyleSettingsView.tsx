import {
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { useContext, useState } from "react";
import CardStyleSettings from "../components/CardStyleSettings";
import MenuButton from "../components/settings/MenuButton";
import { CardSettingsContext } from "../contexts/CardSettingsContext";
import { OzbargainDeal } from "../types/OzbargainDeal";
import DealsPageCards from "./DealsPageCards";

const exampleDeal: OzbargainDeal = {
  title: "Eneloop Pro $13 @ Ozbargain",
  content:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  nid: "1",
  tags: [
    {
      name: "Other",
      url: "/cat/other",
    },
  ],
  username: "sickdeals",
  submittingDate: new Date(),
  dealDomain: "ozbargain.com.au",
  imageUrl: "/assets/images/card-example-eneloop.jpg",
  expiredTag: "Expired",
  isFreebie: true,
  commentCount: "13",
  expiryDate: "13 Jul",
  expiryDateIn: "26 days left",
  voteNegative: "4",
  votePositive: "123",
  viewed: false,
};

const CardStyleSettingsView = () => {
  const { cardSettings } = useContext(CardSettingsContext);
  const [viewed, setViewed] = useState(false);
  const [highlighted, setHighlighted] = useState(false);

  exampleDeal.viewed = viewed;
  exampleDeal.highlighted = highlighted;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <MenuButton />
            {/* <IonBackButton /> */}
          </IonButtons>
          <IonTitle size="small">Card Style Settings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeMd="6">
              <CardStyleSettings showSubset={false} />
            </IonCol>
            <IonCol sizeMd="6">
              <DealsPageCards
                deals={[exampleDeal]}
                showDateDividers={cardSettings.showDateDividers}
                example={true}
              />
              <IonList style={{ marginLeft: "15px", marginRight: "15px" }}>
                <IonItem lines="none">
                  <IonLabel slot="start">Display as 'viewed'</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={viewed}
                    onIonChange={(e) => setViewed(e.detail.checked)}
                  />
                </IonItem>
                <IonItem lines="none">
                  <IonLabel slot="start">Display as 'Highlighted'</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={highlighted}
                    onIonChange={(e) => setHighlighted(e.detail.checked)}
                  />
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default CardStyleSettingsView;
