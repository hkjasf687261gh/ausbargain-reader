import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import { Redirect, Route } from "react-router-dom";
import { CardSettingsProvider } from "./contexts/CardSettingsContext";
import { FiltersProvider } from "./contexts/FiltersContexts";
import { CATEGORIES } from "./helpers/constants";
import CardStyleSettingsView from "./pages/CardStyleSettingsView";
import CategoryView from "./pages/CategoryView";
import DealView from "./pages/DealView";
import FrontpageView from "./pages/FrontpageView";
import NewDealsView from "./pages/NewDealsView";
import SavedView from "./pages/SavedView";
import SearchView from "./pages/SearchView";
import NavigationSwitcher from "./components/NavigationSwitcher";
import "./theme/variables.css";
import "./theme/styles.css";
import { AppSettingsProvider } from "./contexts/AppSettingsContext";
import { ModalsProvider } from "./contexts/ModalsContext";
import AppSettingsModal from "./components/AppSettingsModal";
import CardStyleSettingsModal from "./components/CardStyleSettingsModal";
import DealFilterSettingsModal from "./components/DealFilterSettingsModal";
import { Device } from "@capacitor/device";
import { useEffect } from "react";
import { setupIonicInAppPurchase } from "./helpers/iap";

setupIonicReact({
  swipeBackEnabled: true,
});

const App: React.FC = () => {
  useEffect(() => {
    async function initializeInApPurchaseData() {
      const device = await Device.getInfo();
      if (["ios", "android"].includes(device.operatingSystem)) {
        setupIonicInAppPurchase();
      }
    }
    initializeInApPurchaseData();
  }, []);

  return (
    <IonApp>
      <ModalsProvider>
        <AppSettingsProvider>
          <CardSettingsProvider>
            <FiltersProvider>
              <IonReactRouter>
                <NavigationSwitcher>
                  <IonRouterOutlet id="main">
                    <Route path="/" exact={true}>
                      <Redirect to="/new-deals" />
                    </Route>
                    <Route path="/new-deals" exact={true}>
                      <NewDealsView />
                    </Route>
                    <Route path="/frontpage" exact={true}>
                      <FrontpageView />
                    </Route>
                    <Route path="/saved" exact={true}>
                      <SavedView />
                    </Route>
                    <Route path="/search" exact={true}>
                      <SearchView />
                    </Route>
                    <Route path="/card-settings" exact={true}>
                      <CardStyleSettingsView />
                    </Route>
                    <Route path="/deal/:nid">
                      <DealView />
                    </Route>
                    {CATEGORIES.map((category) => {
                      return (
                        <Route
                          key={`route-${category.id}`}
                          path={category.path}
                          exact={true}
                        >
                          <CategoryView category={category.id} />
                        </Route>
                      );
                    })}
                  </IonRouterOutlet>
                </NavigationSwitcher>

                {/* Modals */}
                <AppSettingsModal />
                <CardStyleSettingsModal />
                <DealFilterSettingsModal />
              </IonReactRouter>
            </FiltersProvider>
          </CardSettingsProvider>
        </AppSettingsProvider>
      </ModalsProvider>
    </IonApp>
  );
};

export default App;
