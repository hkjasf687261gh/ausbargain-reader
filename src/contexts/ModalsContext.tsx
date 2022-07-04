import React, { useState } from "react";

export interface ModalInterface {
  showModal: "app-settings" | "card-style" | "filters" | null;
}

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

type IContextProps = {
  showModal: ModalInterface["showModal"];
  setShowModal: (modal: ModalInterface["showModal"]) => void;
};

const ModalsContext = React.createContext({} as IContextProps);

export const modalsDefaults: ModalInterface = {
  showModal: null,
};

const ModalsProvider = (props: Props) => {
  const [showModal, setShowModal] = useState<ModalInterface["showModal"]>(null);

  return (
    <ModalsContext.Provider value={{ showModal, setShowModal }}>
      {props.children}
    </ModalsContext.Provider>
  );
};

export { ModalsContext, ModalsProvider };
