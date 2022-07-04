import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
} from "@ionic/react";
import { refreshOutline } from "ionicons/icons";
import { useState } from "react";
import DealCard from "../components/deal-card/DealCard";
import Loading from "../components/Loading";
import PopdownMenu from "../components/PopdownMenu";
import MenuButton from "../components/settings/MenuButton";
import { getFavorites, upsertFavorite } from "../helpers/storage/favorites";
import useProxyFetchDeal from "../helpers/useProxyFetchDeal";
import { OzbargainDeal } from "../types/OzbargainDeal";

const SavedView = () => {
  const [favorites, setFavorites] = useState<OzbargainDeal[]>([]);
  const [fetchingFavorites, setfetchingFavorites] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { fetchDeal } = useProxyFetchDeal();

  async function fetchFavorites() {
    const favs = await getFavorites();
    setFavorites(favs);
    setfetchingFavorites(false);
  }

  async function handleRefreshFavorites() {
    setRefreshing(true);

    await Promise.all(favorites.map((fav) => fetchDeal(fav.nid))).then(
      async (result) => {
        // Upsert results
        for (let index = 0; index < result.length; index++) {
          const updatedFavorite = result[index];
          if (updatedFavorite) {
            await upsertFavorite(updatedFavorite);
          }
        }

        // refresh results
        const favs = await getFavorites();
        setFavorites(favs);
        setRefreshing(false);
      }
    );
  }

  useIonViewDidEnter(() => {
    setfetchingFavorites(true);
    fetchFavorites();
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <MenuButton />
            {/* <IonBackButton /> */}
          </IonButtons>
          <IonTitle size="small">Saved</IonTitle>
          <IonButtons slot="end">
            <PopdownMenu
              idPrefix="saved-view"
              startChildren={[
                <IonButton
                  disabled={favorites.length === 0}
                  size="small"
                  shape="round"
                  onClick={handleRefreshFavorites}
                  key="refresh-favorite"
                >
                  <IonIcon
                    slot="icon-only"
                    color="medium"
                    size="small"
                    icon={refreshOutline}
                  />
                </IonButton>,
              ]}
            />
          </IonButtons>
          {refreshing && <IonProgressBar type="indeterminate"></IonProgressBar>}
        </IonToolbar>
      </IonHeader>
      <IonContent id="saved-view">
        {fetchingFavorites && <Loading />}
        {!fetchingFavorites &&
          favorites.map((favorite) => (
            <DealCard
              key={`saved-deal-${favorite.nid}`}
              deal={favorite}
              hideTags={true}
              refreshing={refreshing}
            />
          ))}
      </IonContent>
    </IonPage>
  );
};

export default SavedView;
