import {
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronUpOutline } from "ionicons/icons";
import { useContext, useEffect, useRef } from "react";
import Loading from "../components/Loading";
import PopdownMenu from "../components/PopdownMenu";
import MenuButton from "../components/settings/MenuButton";
import { CardSettingsContext } from "../contexts/CardSettingsContext";
import { UseProxyFetch } from "../helpers/useProxyFetch";
import DealsPageCards from "./DealsPageCards";

interface Props extends Omit<UseProxyFetch, "doSearch" | "loading"> {
  children?: React.ReactNode;
  toolbarChildren?: React.ReactNode;
}

const DealsPage: React.FC<Props> = ({
  deals,
  doRefresh,
  fetchNextPage,
  pageTitle,
  initialLoading,
  children,
  toolbarChildren,
  filteredDealsTotal,
}) => {
  const { cardSettings } = useContext(CardSettingsContext);
  const contentRef = useRef<HTMLIonContentElement>(null);

  function scrollToTop() {
    contentRef.current?.scrollToTop(500);
  }

  useEffect(() => {}, [deals, initialLoading]);

  return (
    <IonPage>
      <IonHeader collapse="fade">
        <IonToolbar>
          <IonButtons slot="start">
            <MenuButton />
            {/* <IonBackButton /> */}
          </IonButtons>
          <IonTitle size="small">{pageTitle}</IonTitle>
          <IonButtons slot="end">
            <PopdownMenu
              // Rendered on each page, so each instance needs its own id
              idPrefix={pageTitle}
              filteredDealsTotal={filteredDealsTotal}
              startChildren={[
                <IonButton shape="round" onClick={scrollToTop}>
                  <IonIcon
                    slot="icon-only"
                    color="medium"
                    size="small"
                    icon={chevronUpOutline}
                  />
                </IonButton>,
              ]}
            />
          </IonButtons>
          {initialLoading && (
            <IonProgressBar type="indeterminate"></IonProgressBar>
          )}
        </IonToolbar>
        {toolbarChildren && <IonToolbar>{toolbarChildren}</IonToolbar>}
      </IonHeader>

      {initialLoading && (
        <IonContent>
          <Loading />
        </IonContent>
      )}

      {!initialLoading && (
        <IonContent ref={contentRef}>
          {/* Refresher */}
          <IonRefresher
            id="123123"
            slot="fixed"
            onIonRefresh={(event) => {
              doRefresh(event);
            }}
          >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          {children && children}

          {/* Content */}
          <DealsPageCards
            deals={deals}
            showDateDividers={cardSettings.showDateDividers}
          />

          {/* Infinate Scroll */}
          <IonInfiniteScroll onIonInfinite={fetchNextPage} threshold="100px">
            <IonInfiniteScrollContent
              loadingSpinner="bubbles"
              loadingText="Loading more data..."
            ></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </IonContent>
      )}
    </IonPage>
  );
};

export default DealsPage;
