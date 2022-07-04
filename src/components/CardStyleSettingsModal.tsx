import { IonModal } from "@ionic/react";
import { useContext } from "react";
import { ModalsContext } from "../contexts/ModalsContext";
import CardStyleSettings from "./CardStyleSettings";
import "./CardStyleSettingsModal.css";

const CardStyleSettingsModal = () => {
  const { showModal, setShowModal } = useContext(ModalsContext);

  return (
    <IonModal
      isOpen={showModal === "card-style"}
      showBackdrop={true}
      initialBreakpoint={1.0}
      breakpoints={[0, 0.5, 1]}
      onDidDismiss={() => setShowModal(null)}
    >
      <CardStyleSettings
        showSubset={true}
        moreButton={true}
        handleMoreButton={() => {
          setShowModal(null);
        }}
      />
    </IonModal>
  );
};

export default CardStyleSettingsModal;
