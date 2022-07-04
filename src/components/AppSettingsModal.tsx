import {
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from "@ionic/react";
import { informationCircle } from "ionicons/icons";
import { useContext } from "react";
import {
  AppSettingsContext,
  AppSettingsInterface,
} from "../contexts/AppSettingsContext";
import { ModalsContext } from "../contexts/ModalsContext";
import { APP_BUILD, APP_NAME } from "../helpers/constants";

const AppSettingsModal = () => {
  const { appSettings, setSingleAppSetting } = useContext(AppSettingsContext);
  const { showModal, setShowModal } = useContext(ModalsContext);

  function handleChangeSetting(value: Partial<AppSettingsInterface>) {
    setSingleAppSetting(value);
  }

  return (
    <IonModal
      isOpen={showModal === "app-settings"}
      showBackdrop={true}
      initialBreakpoint={0.35}
      breakpoints={[0, 0.5, 1]}
      onDidDismiss={() => setShowModal(null)}
    >
      <IonGrid fixed={true}>
        <IonRow>
          <IonCol>
            <IonList>
              <IonItem lines="none">
                <IonLabel>Menu type</IonLabel>
                <IonSelect
                  interface="popover"
                  value={appSettings.navigationType}
                  placeholder="Select One"
                  onIonChange={(e) =>
                    handleChangeSetting({
                      navigationType: e.detail.value,
                    })
                  }
                >
                  <IonSelectOption value="sidebar">Hamburger</IonSelectOption>
                  <IonSelectOption value="tabs">Bottom Tabs</IonSelectOption>
                </IonSelect>
              </IonItem>
              {appSettings.navigationType === "sidebar" && (
                <IonItem lines="none">
                  <IonLabel slot="start">Show all categories</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={appSettings.showAllCategories}
                    onIonChange={(e) =>
                      handleChangeSetting({
                        showAllCategories: e.detail.checked,
                      })
                    }
                  />
                </IonItem>
              )}
              {appSettings.navigationType === "tabs" && (
                <IonItem lines="none">
                  <IonLabel>Tab Menu Labels</IonLabel>
                  <IonToggle
                    slot="end"
                    checked={appSettings.navigationLabels}
                    onIonChange={(e) =>
                      handleChangeSetting({
                        navigationLabels: e.detail.checked,
                      })
                    }
                  />
                </IonItem>
              )}
            </IonList>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonList>
              <IonItem lines="none">
                <IonLabel slot="start">Darkmode</IonLabel>
                <IonToggle
                  slot="end"
                  checked={appSettings.darkmode}
                  onIonChange={(e) =>
                    handleChangeSetting({
                      darkmode: e.detail.checked,
                    })
                  }
                />
              </IonItem>
            </IonList>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonList>
              <IonItem lines="none">
                <IonLabel color="medium">
                  {APP_NAME} {APP_BUILD}
                </IonLabel>
                <IonIcon
                  size="small"
                  slot="start"
                  color="medium"
                  icon={informationCircle}
                />
              </IonItem>
            </IonList>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonModal>
  );
};

export default AppSettingsModal;
