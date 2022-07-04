import {
  IonButton,
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRange,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonToggle,
} from "@ionic/react";
import {
  albumsOutline,
  chatboxEllipsesOutline,
  imageOutline,
  textOutline,
} from "ionicons/icons";
import { useContext } from "react";
import {
  CardSettingsContext,
  CardSettingsInterface,
} from "../contexts/CardSettingsContext";

type Props = {
  showSubset: boolean;
  moreButton?: boolean;
  handleMoreButton?: () => void;
};

const ICON_SMALL_SIZE = "14px";
const ICON_LARGE_SIZE = "20px";

const CardStyleSettings = ({
  showSubset,
  moreButton,
  handleMoreButton,
}: Props) => {
  const { cardSettings, setSingleCardSetting } =
    useContext(CardSettingsContext);

  function handleChangeSetting(value: Partial<CardSettingsInterface> = {}) {
    setSingleCardSetting(value);
  }

  return (
    <IonGrid fixed={true}>
      <IonRow>
        <IonCol>
          <IonList>
            <IonItem lines="none">
              <IonLabel slot="start">Date Dividers</IonLabel>
              <IonToggle
                slot="end"
                checked={cardSettings.showDateDividers}
                onIonChange={() =>
                  handleChangeSetting({
                    showDateDividers: !cardSettings.showDateDividers,
                  })
                }
              />
            </IonItem>
          </IonList>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonList>
            <IonItem lines="none">
              <IonLabel slot="start">Darken Viewed</IonLabel>
              <IonToggle
                slot="end"
                checked={cardSettings.darkenViewedDeals}
                onIonChange={() =>
                  handleChangeSetting({
                    darkenViewedDeals: !cardSettings.darkenViewedDeals,
                  })
                }
              />
            </IonItem>
            {cardSettings.darkenViewedDeals && (
              <IonItem lines="none">
                <IonLabel>Darken Opacity</IonLabel>
                <RangeWrapper>
                  <IonIcon
                    color="medium"
                    icon={albumsOutline}
                    style={{ opacity: 0.2, fontSize: ICON_SMALL_SIZE }}
                  />
                  <IonRange
                    disabled={!cardSettings.darkenViewedDeals}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    color="secondary"
                    value={cardSettings.darkenViewedDealsOpacity}
                    onIonChange={(e) =>
                      handleChangeSetting({
                        darkenViewedDealsOpacity: e.detail.value as any,
                      })
                    }
                  />
                  <IonIcon
                    color="medium"
                    icon={albumsOutline}
                    size="large"
                    style={{ opacity: 1.0, fontSize: ICON_LARGE_SIZE }}
                  />
                </RangeWrapper>
              </IonItem>
            )}
          </IonList>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol>
          <IonList>
            <IonItem lines="none">
              <IonLabel>Highlight Colour</IonLabel>
              <IonSelect
                value={cardSettings.highlightColor}
                interface="popover"
                onIonChange={(e) =>
                  handleChangeSetting({
                    highlightColor: e.detail
                      .value as CardSettingsInterface["highlightColor"],
                  })
                }
              >
                <IonSelectOption value="green">Green</IonSelectOption>
                <IonSelectOption value="red">Red</IonSelectOption>
                <IonSelectOption value="yellow">Yellow</IonSelectOption>
                <IonSelectOption value="blue">Blue</IonSelectOption>
              </IonSelect>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Image Height</IonLabel>
              <RangeWrapper>
                <IonIcon
                  color="medium"
                  icon={imageOutline}
                  style={{ fontSize: ICON_SMALL_SIZE }}
                />
                <IonRange
                  min={0}
                  max={400}
                  color="secondary"
                  value={cardSettings.cardImageHeight}
                  onIonChange={(e) =>
                    handleChangeSetting({
                      cardImageHeight: e.detail.value as any,
                    })
                  }
                />
                <IonIcon
                  color="medium"
                  icon={imageOutline}
                  style={{ fontSize: ICON_LARGE_SIZE }}
                />
              </RangeWrapper>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Title Text Size</IonLabel>
              <RangeWrapper>
                <IonIcon
                  color="medium"
                  icon={textOutline}
                  style={{ fontSize: ICON_SMALL_SIZE }}
                />
                <IonRange
                  min={14}
                  max={24}
                  color="secondary"
                  value={cardSettings.cardTitleSize}
                  onIonChange={(e) =>
                    handleChangeSetting({
                      cardTitleSize: e.detail.value as any,
                    })
                  }
                />
                <IonIcon
                  color="medium"
                  icon={textOutline}
                  style={{ fontSize: ICON_LARGE_SIZE }}
                />
              </RangeWrapper>
            </IonItem>
          </IonList>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonList>
            <IonItem lines="none">
              <IonLabel slot="start">Content Section</IonLabel>
              <IonToggle
                slot="end"
                checked={cardSettings.groupContent}
                onIonChange={() =>
                  handleChangeSetting({
                    groupContent: !cardSettings.groupContent,
                  })
                }
              />
            </IonItem>
            {!showSubset && (
              <>
                <IonItem lines="none">
                  <IonLabel>Content Text Size</IonLabel>
                  <RangeWrapper>
                    <IonIcon
                      color="medium"
                      icon={textOutline}
                      style={{ fontSize: ICON_SMALL_SIZE }}
                    />
                    <IonRange
                      disabled={!cardSettings.groupContent}
                      min={12}
                      max={18}
                      color="secondary"
                      value={cardSettings.cardContentSize}
                      onIonChange={(e) =>
                        handleChangeSetting({
                          cardContentSize: e.detail.value as any,
                        })
                      }
                    />
                    <IonIcon
                      color="medium"
                      icon={textOutline}
                      style={{ fontSize: ICON_LARGE_SIZE }}
                    />
                  </RangeWrapper>
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Content Length</IonLabel>
                  <RangeWrapper>
                    <IonIcon
                      color="medium"
                      icon={chatboxEllipsesOutline}
                      style={{ fontSize: ICON_SMALL_SIZE }}
                    />
                    <IonRange
                      disabled={!cardSettings.groupContent}
                      min={0}
                      max={250}
                      color="secondary"
                      value={cardSettings.cardDescriptionTrimLength}
                      onIonChange={(e) =>
                        handleChangeSetting({
                          cardDescriptionTrimLength: e.detail.value as any,
                        })
                      }
                    />

                    <IonIcon
                      color="medium"
                      icon={chatboxEllipsesOutline}
                      style={{ fontSize: ICON_LARGE_SIZE }}
                    />
                  </RangeWrapper>
                </IonItem>
              </>
            )}
          </IonList>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonList>
            <IonItem lines="none">
              <IonLabel slot="start">Vote Section</IonLabel>
              <IonToggle
                slot="end"
                checked={cardSettings.groupVotes}
                onIonChange={() =>
                  handleChangeSetting({
                    groupVotes: !cardSettings.groupVotes,
                  })
                }
              />
            </IonItem>
            {!showSubset && (
              <>
                <IonItem lines="none">
                  <IonLabel slot="start">Vote Icons</IonLabel>
                  <IonToggle
                    disabled={!cardSettings.groupVotes}
                    slot="end"
                    checked={cardSettings.cardVotesIconShow}
                    onIonChange={() =>
                      handleChangeSetting({
                        cardVotesIconShow: !cardSettings.cardVotesIconShow,
                      })
                    }
                  />
                </IonItem>
                <IonItem lines="none">
                  <IonLabel>Vote Alignment</IonLabel>
                  <IonSelect
                    disabled={!cardSettings.groupVotes}
                    value={cardSettings.cardVotesAlignment}
                    interface="popover"
                    onIonChange={(e) =>
                      handleChangeSetting({
                        cardVotesAlignment: e.detail
                          .value as CardSettingsInterface["cardVotesAlignment"],
                      })
                    }
                  >
                    <IonSelectOption value="right">Right</IonSelectOption>
                    <IonSelectOption value="bottom">Bottom</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </>
            )}
          </IonList>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonList>
            <IonItem lines="none">
              <IonLabel slot="start">Subtitle Section</IonLabel>
              <IonToggle
                slot="end"
                checked={cardSettings.groupSubtitle}
                onIonChange={() =>
                  handleChangeSetting({
                    groupSubtitle: !cardSettings.groupSubtitle,
                  })
                }
              />
            </IonItem>
            {!showSubset && (
              <>
                <IonItem lines="none">
                  <IonLabel slot="start">Deal Poster Name</IonLabel>
                  <IonToggle
                    disabled={!cardSettings.groupSubtitle}
                    slot="end"
                    checked={cardSettings.cardDealPosterNameShow}
                    onIonChange={() =>
                      handleChangeSetting({
                        cardDealPosterNameShow:
                          !cardSettings.cardDealPosterNameShow,
                      })
                    }
                  />
                </IonItem>
                <IonItem lines="none">
                  <IonLabel slot="start">Submitted Date</IonLabel>
                  <IonToggle
                    disabled={!cardSettings.groupSubtitle}
                    slot="end"
                    checked={cardSettings.cardSubmittedDateShow}
                    onIonChange={() =>
                      handleChangeSetting({
                        cardSubmittedDateShow:
                          !cardSettings.cardSubmittedDateShow,
                      })
                    }
                  />
                </IonItem>
                <IonItem lines="none">
                  <IonLabel slot="start">Domain URL</IonLabel>
                  <IonToggle
                    disabled={!cardSettings.groupSubtitle}
                    slot="end"
                    checked={cardSettings.cardDomainUrlShow}
                    onIonChange={() =>
                      handleChangeSetting({
                        cardDomainUrlShow: !cardSettings.cardDomainUrlShow,
                      })
                    }
                  />
                </IonItem>
              </>
            )}
          </IonList>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonList>
            <IonItem lines="none">
              <IonLabel slot="start">Categories</IonLabel>
              <IonToggle
                slot="end"
                checked={cardSettings.cardCategoryShow}
                onIonChange={() =>
                  handleChangeSetting({
                    cardCategoryShow: !cardSettings.cardCategoryShow,
                  })
                }
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel slot="start">Comment Count</IonLabel>
              <IonToggle
                slot="end"
                checked={cardSettings.cardCommentCountShow}
                onIonChange={() =>
                  handleChangeSetting({
                    cardCommentCountShow: !cardSettings.cardCommentCountShow,
                  })
                }
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel slot="start">Expiry Date</IonLabel>
              <IonToggle
                slot="end"
                checked={cardSettings.expiryDate}
                onIonChange={() =>
                  handleChangeSetting({
                    expiryDate: !cardSettings.expiryDate,
                  })
                }
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel slot="start">Freebie Tag</IonLabel>
              <IonToggle
                slot="end"
                checked={cardSettings.freebie}
                onIonChange={() =>
                  handleChangeSetting({
                    freebie: !cardSettings.freebie,
                  })
                }
              />
            </IonItem>
          </IonList>
        </IonCol>
      </IonRow>
      {moreButton && (
        <IonRow>
          <IonCol>
            <IonButton
              color="tertiary"
              expand="block"
              routerLink="/card-settings"
              routerDirection="forward"
              onClick={handleMoreButton}
              strong={true}
              className="more-button"
            >
              More
            </IonButton>
          </IonCol>
        </IonRow>
      )}
    </IonGrid>
  );
};

export default CardStyleSettings;

type RangeWrapperProps = {
  children: React.ReactChild | React.ReactChild[];
};

const RangeWrapper = ({ children }: RangeWrapperProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        paddingLeft: "10px",
      }}
    >
      {children}
    </div>
  );
};
