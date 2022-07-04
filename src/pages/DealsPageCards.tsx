import {
  IonText
} from "@ionic/react";
import DealCard from "../components/deal-card/DealCard";
import { CardSettingsInterface } from "../contexts/CardSettingsContext";
import { formatSubmittedAtDay, relativeTime } from "../helpers/formatters";
import { OzbargainDeal } from "../types/OzbargainDeal";
import "./DealsPageCards.css";

type Props = {
  deals: OzbargainDeal[];
  showDateDividers: CardSettingsInterface["showDateDividers"];
  example?: boolean;
};

const DealsPageCards = ({ deals, showDateDividers, example }: Props) => {
  let currentDate: Date | null = null;

  return (
    <>
      {deals.map((deal, index) => {
        const showDateHeader =
          (!currentDate && deal.submittingDate) ||
          (deal.submittingDate &&
            currentDate &&
            currentDate.toDateString() !== deal.submittingDate.toDateString());

        if (deal.submittingDate) {
          currentDate = deal.submittingDate;
        }

        return (
          <span key={`card-${deal.nid}`}>
            {showDateDividers && showDateHeader && currentDate && (
              <IonText color="medium">
                <h5
                  className={`deal-card-title--divider ${index === 0 ? "deal-card-title--divider--no-margin" : ""
                    }`}
                >
                  <span>{formatSubmittedAtDay(currentDate)}</span>{" "}
                  <span className="deal-card-title--time-ago">
                    ({relativeTime(currentDate)})
                  </span>
                </h5>
              </IonText>
            )}
            <DealCard
              key={`${index}` + deal.title}
              deal={deal}
              example={example}
            />
          </span>
        );
      })}
    </>
  );
};

export default DealsPageCards;
