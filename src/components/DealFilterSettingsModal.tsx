import {
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import { useContext, useState } from "react";
import { FiltersContext, FiltersInterface } from "../contexts/FiltersContexts";
import { ModalsContext } from "../contexts/ModalsContext";
import { CATEGORIES } from "../helpers/constants";

type Props = {
  filteredDealsTotal?: number;
};

const DealFilterSettingsModal = ({ filteredDealsTotal }: Props) => {
  const { showModal, setShowModal } = useContext(ModalsContext);
  const { filters, setSingleFilter } = useContext(FiltersContext);
  const [excludeWordInput, setExcludeWordInput] = useState("");
  const [highlightWordInput, setHighlightWordInput] = useState("");

  function handleChangeSetting(value: Partial<FiltersInterface>) {
    setSingleFilter(value);
  }

  function handleExcludeWords() {
    if (!excludeWordInput) return;
    handleChangeSetting({
      excludeWords: [...filters.excludeWords, excludeWordInput],
    });
    setExcludeWordInput("");
  }

  function handleRemoveExcludeWord(value: string) {
    if (!value) return;
    handleChangeSetting({
      excludeWords: filters.excludeWords.filter((word) => word !== value),
    });
  }

  function handleHighlightWords() {
    if (!highlightWordInput) return;
    handleChangeSetting({
      highlightWords: [...filters.highlightWords, highlightWordInput],
    });
    setHighlightWordInput("");
  }

  function handleRemoveHighlightWord(value: string) {
    if (!value) return;
    handleChangeSetting({
      highlightWords: filters.highlightWords.filter((word) => word !== value),
    });
  }

  return (
    <IonModal
      isOpen={showModal === "filters"}
      showBackdrop={true}
      initialBreakpoint={0.5}
      breakpoints={[0, 0.5, 1]}
      onDidDismiss={() => setShowModal(null)}
    >
      <IonGrid fixed={true}>
        <IonRow>
          <IonCol>
            <IonList>
              <IonItem lines="full">
                <IonLabel>Exclude Categories</IonLabel>
                <IonSelect
                  value={filters.hideCategories}
                  multiple
                  placeholder="Select One"
                  onIonChange={(e) =>
                    handleChangeSetting({
                      hideCategories: e.detail.value,
                    })
                  }
                >
                  {CATEGORIES.map((category, index) => (
                    <IonSelectOption
                      key={`filter-category-${category.id}`}
                      value={category.title}
                    >
                      {category.title}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonItem lines="none">
                <IonInput
                  placeholder="Exclude deals with..."
                  clearInput
                  clearOnEdit
                  enterkeyhint="enter"
                  value={excludeWordInput}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleExcludeWords();
                    }
                  }}
                  onIonChange={(e) => {
                    setExcludeWordInput(e.detail.value || "");
                  }}
                />
              </IonItem>
              {filters.excludeWords.length > 0 && (
                <div
                  style={{
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    paddingBottom: "15px",
                  }}
                >
                  {filters.excludeWords.map((word, index) => (
                    <IonChip
                      key={index + word}
                      onClick={() => handleRemoveExcludeWord(word)}
                    >
                      <IonLabel>{word}</IonLabel>
                      <IonIcon icon={closeCircle} />
                    </IonChip>
                  ))}
                </div>
              )}
            </IonList>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonList>
              <IonItem lines="none">
                <IonInput
                  placeholder="Highlight deals with..."
                  clearInput
                  clearOnEdit
                  enterkeyhint="enter"
                  value={highlightWordInput}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      handleHighlightWords();
                    }
                  }}
                  onIonChange={(e) => {
                    setHighlightWordInput(e.detail.value || "");
                  }}
                />
              </IonItem>
              {filters.highlightWords.length > 0 && (
                <div
                  style={{
                    paddingLeft: "15px",
                    paddingRight: "15px",
                    paddingBottom: "15px",
                  }}
                >
                  {filters.highlightWords.map((word, index) => (
                    <IonChip
                      key={index + word}
                      onClick={() => handleRemoveHighlightWord(word)}
                    >
                      <IonLabel>{word}</IonLabel>
                      <IonIcon icon={closeCircle} />
                    </IonChip>
                  ))}
                </div>
              )}
            </IonList>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonList>
              <IonItem lines="none">
                <IonLabel slot="start">Show Expired Deals</IonLabel>
                <IonToggle
                  slot="end"
                  checked={filters.showExpired}
                  onIonChange={() =>
                    handleChangeSetting({
                      showExpired: !filters.showExpired,
                    })
                  }
                />
              </IonItem>
              <IonItem lines="none">
                <IonLabel slot="start">Show Freebies</IonLabel>
                <IonToggle
                  slot="end"
                  checked={filters.showFreebies}
                  onIonChange={() =>
                    handleChangeSetting({
                      showFreebies: !filters.showFreebies,
                    })
                  }
                />
              </IonItem>
            </IonList>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonModal>
  );
};

export default DealFilterSettingsModal;
