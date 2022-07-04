import { IonContent, IonImg, IonModal } from "@ionic/react";
import { useRef } from "react";
import "./ImageModal.css";

type Props = {
  imageUrl: string;
};

const ImageModal = ({ imageUrl }: Props) => {
  const routerRef = useRef<HTMLIonRouterOutletElement | null>(null);
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      <IonImg
        src={imageUrl}
        id="open-image-modal"
        style={{
          margin: "5px",
          height: "250px",
          objectFit: "cover",
        }}
      />
      <IonModal
        ref={modal}
        trigger="open-image-modal"
        id="image-modal"
        canDismiss={true}
        presentingElement={routerRef.current || undefined}
      >
        <IonContent>
          <IonImg
            src={imageUrl}
            style={{
              margin: "5px",
            }}
          />
        </IonContent>
      </IonModal>
    </>
  );
};

export default ImageModal;
