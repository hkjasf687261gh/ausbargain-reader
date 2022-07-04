import { Device } from "@capacitor/device";
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
} from "@ionic/react";
import {
  colorPaletteOutline,
  ellipsisHorizontal,
  filterOutline,
  settingsOutline,
  walletOutline,
} from "ionicons/icons";
import React, { useContext } from "react";
import { ModalsContext } from "../contexts/ModalsContext";
import { iapStore, purchaseItems } from "../helpers/iap";
import "./PopdownMenu.css";

type Props = {
  startChildren?: React.ReactNode[];
  idPrefix: string;
  filteredDealsTotal?: number;
};

const PopdownMenu = ({
  startChildren,
  idPrefix,
  filteredDealsTotal,
}: Props) => {
  const { setShowModal } = useContext(ModalsContext);

  const id = `${idPrefix}-settings-popover`;

  const showFilteredDealsCount =
    filteredDealsTotal && filteredDealsTotal > 0 ? true : false;

  async function handleDonate() {
    const deviceInfo = await Device.getInfo();

    if (["ios", "android"].includes(deviceInfo.platform)) {
      iapStore.order(purchaseItems.donation.id);
    } else {
      console.log("go to online purachse");
    }
  }

  return (
    <>
      {startChildren &&
        startChildren.map((child, index) => (
          <div key={`${id}-start-child-${index}`}>{child}</div>
        ))}
      <IonButton
        shape="round"
        onClick={() => setShowModal("filters")}
        style={{ width: "fit-content" }}
      >
        <IonIcon
          slot={showFilteredDealsCount ? "start" : "icon-only"}
          color="medium"
          icon={filterOutline}
          size="small"
        />
        {showFilteredDealsCount && (
          <IonLabel color="danger" style={{ opacity: 0.75 }}>
            {filteredDealsTotal}
          </IonLabel>
        )}
      </IonButton>
      <IonButton id={id} color="medium" shape="round">
        <IonIcon
          slot="icon-only"
          icon={ellipsisHorizontal}
          size="small"
          color="medium"
        />
      </IonButton>
      <IonPopover trigger={id} dismissOnSelect className="popdown-menu">
        <IonList>
          <IonItem
            button
            shape="round"
            onClick={() => setShowModal("card-style")}
            lines="none"
          >
            <IonLabel>Card Style</IonLabel>
            <IonIcon
              size="small"
              slot="start"
              color="medium"
              icon={colorPaletteOutline}
            />
          </IonItem>
          <IonItem
            button
            shape="round"
            onClick={() => setShowModal("app-settings")}
            lines="full"
          >
            <IonLabel>Settings</IonLabel>
            <IonIcon
              size="small"
              slot="start"
              color="medium"
              icon={settingsOutline}
            />
          </IonItem>
          <IonItem button shape="round" onClick={handleDonate} lines="none">
            <IonLabel style={{ fontWeight: "bold" }}>Donate Eneloops</IonLabel>
            <IonIcon
              size="small"
              slot="start"
              color="success"
              icon={walletOutline}
            />
          </IonItem>
        </IonList>
      </IonPopover>
    </>
  );
};

export default PopdownMenu;
