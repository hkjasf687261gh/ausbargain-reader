import { IonSpinner } from "@ionic/react";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "100px",
      }}
    >
      <IonSpinner name="dots" />
    </div>
  );
};

export default Loading;
