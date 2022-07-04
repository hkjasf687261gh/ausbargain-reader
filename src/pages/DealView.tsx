import { Browser } from "@capacitor/browser";
import {
  IonButton,
  IonButtons,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonProgressBar,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  addOutline,
  openOutline,
  pricetag,
  removeOutline,
} from "ionicons/icons";
import { useEffect } from "react";
import { useParams } from "react-router";
import CommentComponent from "../components/CommentComponent";
import ImageModal from "../components/ImageModal";
import Loading from "../components/Loading";
import MenuButton from "../components/settings/MenuButton";
import SaveToFavorites from "../components/settings/SaveToFavorites";
import ShareButton from "../components/settings/ShareDeal";
import { goToDealUrl, ozBargainDealUrl } from "../helpers/constants";
import { formatSubtitle, formatTitle } from "../helpers/formatters";
import useProxyFetchDeal from "../helpers/useProxyFetchDeal";
import "./DealView.css";

const DealView = () => {
  const { nid } = useParams<{ nid: string }>();
  const { deal, initializePage, initialLoading } = useProxyFetchDeal();

  useEffect(() => {
    initializePage(nid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nid]);

  async function openDealInBrowser(url: string) {
    await Browser.open({ url });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <MenuButton />
            {/* <IonBackButton /> */}
          </IonButtons>
          <IonTitle size="small">Deal</IonTitle>
          <IonButtons slot="end">
            {deal && <ShareButton componentType="button" deal={deal} />}
            {deal && <SaveToFavorites componentType="button" deal={deal} />}
          </IonButtons>
          {initialLoading && (
            <IonProgressBar type="indeterminate"></IonProgressBar>
          )}
        </IonToolbar>
      </IonHeader>
      {initialLoading && <Loading />}
      {!initialLoading && deal && (
        <IonContent>
          <IonGrid id="deal-view">
            <IonRow>
              <IonCol>
                <IonText>
                  <h1 style={{ marginBottom: "5px" }}>
                    {formatTitle(deal.title)}
                  </h1>
                  <IonText color="medium">
                    <p style={{ margin: 0 }}>{formatSubtitle(deal)}</p>
                  </IonText>
                </IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="12">
                {deal.imageUrl && <ImageModal imageUrl={deal.imageUrl} />}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "start",
                  }}
                >
                  <IonChip outline={true} color="success">
                    <IonIcon icon={addOutline} />
                    <IonLabel>{deal.votePositive}</IonLabel>
                  </IonChip>
                  <IonChip outline={true} color="danger">
                    <IonIcon icon={removeOutline} />
                    <IonLabel>{deal.voteNegative}</IonLabel>
                  </IonChip>
                  <IonChip color="dark">
                    <IonLabel>{deal.clicks} clicks</IonLabel>
                  </IonChip>
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="block"
                  color="medium"
                  fill="outline"
                  onClick={() => openDealInBrowser(ozBargainDealUrl(deal.nid))}
                >
                  View in&nbsp;
                  <span style={{ fontWeight: "bold" }}>OzBargain</span>
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  color="medium"
                  fill="outline"
                  onClick={() => openDealInBrowser(goToDealUrl(deal.nid))}
                >
                  Go To{" "}
                  {deal.dealDomain ? (
                    <span style={{ fontWeight: "bold" }}>
                      &nbsp;{`${deal.dealDomain}`}
                    </span>
                  ) : (
                    "Deal"
                  )}
                  <IonIcon slot="end" icon={openOutline} />
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              {/* Left Column */}
              <IonCol>
                <IonRow>
                  <IonCol size="12">
                    <div
                      dangerouslySetInnerHTML={{ __html: deal.content }}
                    ></div>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    {deal.tags &&
                      deal.tags.map((tag) => (
                        <IonChip
                          key={`comment-${deal.nid}-tag-${tag.name}`}
                          outline={true}
                          color="secondary"
                        >
                          <IonIcon icon={pricetag} />
                          <IonLabel>{tag.name}</IonLabel>
                        </IonChip>
                      ))}
                  </IonCol>
                </IonRow>

                {/* Comments */}
                <IonRow>
                  <IonCol>
                    <IonText>
                      <h4 style={{ fontWeight: "bold" }}>Comments</h4>
                    </IonText>
                    <hr style={{ height: "1px", background: "#6d6d6d" }} />
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    {deal.comments?.map((comment) => (
                      <CommentComponent
                        key={`comment-${comment.id}`}
                        comment={comment}
                      />
                    ))}
                  </IonCol>
                </IonRow>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      )}
    </IonPage>
  );
};

export default DealView;
