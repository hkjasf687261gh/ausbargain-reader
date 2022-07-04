import {
  IonIcon, IonLabel, IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonTabs
} from "@ionic/react";
import React, { useContext } from "react";
import { AppSettingsContext } from "../contexts/AppSettingsContext";
import { AppPage, pageMeta } from "../helpers/constants";
import Menu from "./Menu";

export const sidebarAppPages: AppPage[] = [
  pageMeta.search,
  pageMeta.frontPage,
  pageMeta.newDeals,
  pageMeta.saved,
];

const tabsAppPages: AppPage[] = [
  pageMeta.frontPage,
  pageMeta.newDeals,
  pageMeta.saved,
  pageMeta.search,
];

type Props = {
  children: React.ReactNode;
};

const NavigationSwitcher = ({ children }: Props) => {
  const { appSettings } = useContext(AppSettingsContext);

  return appSettings.navigationType === "sidebar" ? (
    <IonSplitPane contentId="main">
      <Menu />
      {children}
    </IonSplitPane>
  ) : (
    <IonTabs>
      {children}
      <IonTabBar slot="bottom">
        {tabsAppPages.map((appPage) => (
          <IonTabButton key={appPage.id} tab={appPage.id} href={appPage.url}>
            <IonIcon ios={appPage.iosIcon} md={appPage.mdIcon} size="small" />
            {appSettings.navigationLabels && <IonLabel>{appPage.title}</IonLabel>}
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};

export default NavigationSwitcher;
