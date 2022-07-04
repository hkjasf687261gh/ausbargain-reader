import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonImg,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import { IonicReactProps } from "@ionic/react/dist/types/components/IonicReactProps";
import { calendar, chatbubbles, pricetag } from "ionicons/icons";
import { useRef, useState } from "react";
import { useInView } from "react-cool-inview";
import { formatSubmittedAt, formatTitle } from "../../helpers/formatters";
import { setDateViewedItem } from "../../helpers/storage/viewed";
import { useBargainSettings } from "../../helpers/useBargainSettings";
import { getHighlightColour } from "../../theme/highlight-colours";
import { OzbargainDeal } from "../../types/OzbargainDeal";
import "./DealCard.css";
import VoteChips from "./VoteChips";

type Props = {
  deal: OzbargainDeal;
  hideTags?: boolean;
  example?: boolean;
  refreshing?: boolean;
};

const DealCard = ({ deal, hideTags, example, refreshing }: Props) => {
  const [viewed, setViewed] = useState(deal.viewed);
  const { trimContent, cardSettings } = useBargainSettings();

  const spinnerRef = useRef<HTMLDivElement>(null);

  const { observe } = useInView({
    threshold: 0,
    onLeave: ({ scrollDirection }) => {
      // Only mark deals as viewed if scrolling down, it felt weird to mark them as viewed when scrolling up
      if (scrollDirection.vertical === "down") return;
      if (
        viewed ||
        !deal.submittingDate ||
        // Submitting date is stored as string when saved
        typeof deal.submittingDate === "string"
      )
        return;
      setDateViewedItem(deal.submittingDate, deal.nid);
      setViewed(true);
    },
  });

  const trimmedContent = trimContent(deal.content);
  const showContent =
    cardSettings.groupContent && deal.content && trimmedContent;

  const showSubtitle =
    cardSettings.groupSubtitle &&
    (cardSettings.cardDealPosterNameShow ||
      cardSettings.cardSubmittedDateShow ||
      cardSettings.cardDomainUrlShow);

  const cardStyle: IonicReactProps["style"] = {};

  if ((cardSettings.darkenViewedDeals && viewed) || (example && deal.viewed)) {
    cardStyle.opacity = cardSettings.darkenViewedDealsOpacity;
  }

  if (deal.highlighted) {
    cardStyle.borderLeft = `10px solid var(${getHighlightColour(
      cardSettings.highlightColor
    )})`;
  }

  function getSpinnerOverlayDimensions(): React.CSSProperties | undefined {
    if (!spinnerRef.current) return;
    const { offsetHeight, offsetWidth } = spinnerRef.current;
    return {
      position: "absolute",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: `${offsetWidth}px`,
      height: `${offsetHeight}px`,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    };
  }

  return (
    <IonCard
      disabled={refreshing}
      button={!example}
      style={cardStyle}
      id={`deal-card-${deal.nid}`}
      routerLink={example ? undefined : `/deal/${deal.nid}`}
      ref={observe}
    >
      {/* Overlay a spinner if we are refreshing the deals */}
      {refreshing && (
        <div style={getSpinnerOverlayDimensions()}>
          <IonSpinner />
        </div>
      )}
      <div
        ref={spinnerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "5px",
        }}
      >
        <IonImg
          src={deal.imageUrl || ""}
          style={{
            height: `${cardSettings.cardImageHeight}px`,
            objectFit: "cover",
          }}
        />
      </div>

      <IonCardHeader>
        {deal.expiredTag && (
          <IonChip
            color={"danger"}
            style={{ margin: "0", marginBottom: "10px" }}
          >
            <IonLabel>
              <strong>{deal.expiredTag.toUpperCase()}</strong>
            </IonLabel>
          </IonChip>
        )}
        <IonCardTitle style={{ fontSize: `${cardSettings.cardTitleSize}px` }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div>{formatTitle(deal.title)}</div>
            {cardSettings.groupVotes &&
              cardSettings.cardVotesAlignment === "right" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                  }}
                >
                  <VoteChips deal={deal} settings={cardSettings} />{" "}
                </div>
              )}
          </div>
        </IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {showContent && (
          <div
            style={{
              fontSize: `${cardSettings.cardContentSize}px`,
              padding: "0 0 15px 0",
            }}
          >
            {trimmedContent}
          </div>
        )}

        {showSubtitle && (
          <IonCardSubtitle style={{ padding: "0 0 15px 0" }}>
            {deal.username &&
              cardSettings.cardDealPosterNameShow &&
              `${deal.username}`}{" "}
            {deal.associated && (
              <span className="deal-card--associated"> (Associated)</span>
            )}
            {deal.referrer && (
              <span className="deal-card--referrer"> (Referrer)</span>
            )}
            {deal.submittingDate &&
              cardSettings.cardSubmittedDateShow &&
              ` - ${formatSubmittedAt(deal.submittingDate)}`}
            {deal.dealDomain && cardSettings.cardDomainUrlShow && (
              <>
                {" "}
                - <strong>{deal.dealDomain}</strong>
              </>
            )}
          </IonCardSubtitle>
        )}

        <div>
          {cardSettings.groupVotes &&
            cardSettings.cardVotesAlignment === "bottom" && (
              <VoteChips settings={cardSettings} deal={deal} />
            )}
          {deal.commentCount && cardSettings.cardCommentCountShow && (
            <IonChip outline={true} color="secondary">
              <IonIcon icon={chatbubbles} />
              <IonLabel>{deal.commentCount}</IonLabel>
            </IonChip>
          )}
          {cardSettings.freebie && deal.isFreebie && (
            <IonChip outline={true} color="success">
              <IonIcon icon={pricetag} />
              <IonLabel>freebie</IonLabel>
            </IonChip>
          )}
          {cardSettings.expiryDate && deal.expiryDate && (
            <IonChip outline={true} color="warning">
              <IonIcon icon={calendar} />
              <IonLabel>
                {deal.expiryDate}{" "}
                {deal.expiryDateIn && (
                  <span style={{ opacity: 0.6 }}>({deal.expiryDateIn})</span>
                )}
              </IonLabel>
            </IonChip>
          )}

          {!hideTags &&
            cardSettings.cardCategoryShow &&
            deal.tags &&
            deal.tags.map((tag) => (
              <IonChip
                outline={true}
                color="secondary"
                key={`deal-${deal.nid}-tag-${tag.name}`}
              >
                <IonIcon icon={pricetag} />
                <IonLabel>{tag.name}</IonLabel>
              </IonChip>
            ))}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default DealCard;
