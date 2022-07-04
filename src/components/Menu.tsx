import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from "@ionic/react";
import { starOutline } from "ionicons/icons";
import _ from "lodash";
import { useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { AppSettingsContext } from "../contexts/AppSettingsContext";
import { CATEGORIES } from "../helpers/constants";
import "./Menu.css";
import { sidebarAppPages } from "./NavigationSwitcher";

const Menu: React.FC = () => {
  const location = useLocation();
  const { appSettings, setSingleAppSetting } = useContext(AppSettingsContext);
  const menuRef = useRef<HTMLIonMenuElement>(null);

  function handleSetFavoriteCategory(value: string) {
    let updatedCategories = appSettings.favoriteCatagories;

    if (appSettings.favoriteCatagories.includes(value)) {
      updatedCategories = updatedCategories.filter(
        (category) => category !== value
      );
    } else {
      updatedCategories = [...updatedCategories, value];
    }

    setSingleAppSetting({
      favoriteCatagories: updatedCategories,
    });
  }

  function closeMenu() {
    menuRef.current?.setOpen(false);
  }

  const favoriteCatagories = _.cloneDeep(
    CATEGORIES.filter((category) =>
      appSettings.favoriteCatagories.includes(category.id)
    )
  );
  favoriteCatagories.forEach((category) => {
    category.favorite = true;
  });
  const favoriteCategoryIds = favoriteCatagories.map((cat) => cat.id);
  const hasFavorites = favoriteCatagories.length > 0;
  const otherCategories = appSettings.showAllCategories
    ? CATEGORIES.filter(
        (category) => !favoriteCategoryIds.includes(category.id)
      )
    : [];

  return (
    <IonMenu contentId="main" type="push" ref={menuRef}>
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>
            <IonLabel>OzBargain</IonLabel>
          </IonListHeader>

          {sidebarAppPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={`menu-${appPage.title}`} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="forward"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Categories</IonListHeader>
          {[...favoriteCatagories, ...otherCategories].map((category) => (
            // <IonMenuToggle key={`menu-${category.id}`} autoHide={false}>
            <IonItem
              key={`menu-${category.id}`}
              className={location.pathname === category.path ? "selected" : ""}
              routerLink={category.path}
              routerDirection="forward"
              lines="none"
              detail={false}
              onClick={closeMenu}
            >
              <IonIcon slot="start" icon={category.icon} size="small" />
              <IonLabel
                style={{
                  opacity: !hasFavorites ? 1.0 : category.favorite ? 1.0 : 0.5,
                }}
              >
                {category.title}
              </IonLabel>
              <IonButton
                slot="end"
                shape="round"
                fill="clear"
                style={{
                  opacity: category.favorite ? 1.0 : 0.2,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSetFavoriteCategory(category.id);
                }}
              >
                <IonIcon slot="icon-only" icon={starOutline} size="small" />
              </IonButton>
            </IonItem>
            // </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
