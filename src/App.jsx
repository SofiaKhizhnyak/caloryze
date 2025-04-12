import "./styles/index.css";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { addCircleOutline, calendarOutline, listOutline } from "ionicons/icons";
import Start from "./pages/Start";
import Add from "./pages/Add";
import History from "./pages/History";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import { useAppContext } from "./contexts/AppContext";

setupIonicReact();

const App = () => {
  const { days, isCurrentDayToday } = useAppContext();

  return (
    <IonApp>
      <IonReactRouter>
        <IonHeader>
          <IonToolbar>
            <IonTitle
              style={{
                fontSize: "2.1rem",
                fontWeight: "900",
                color: "#e03901",
                padding: "0 0 0 5%",
              }}
            >
              Calo
              <span
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "100",
                  color: "black",
                }}
              >
                ryze
              </span>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  color: "#322f2fa4",
                  letterSpacing: "0.08rem",
                }}
              >
                {" "}
                every bite counts
              </span>
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/start" component={Start} />

            <Route exact path="/add" component={Add} />

            <Route path="/history" component={History} />

            <Route exact path="/">
              <Redirect to="/start" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/start">
              <IonIcon aria-hidden="true" icon={addCircleOutline} />
            </IonTabButton>
            <IonTabButton
              tab="tab2"
              href="/add"
              disabled={!isCurrentDayToday()}
            >
              <IonIcon aria-hidden="true" icon={listOutline} />
            </IonTabButton>
            <IonTabButton tab="tab3" href="/history" disabled={days.length < 1}>
              <IonIcon aria-hidden="true" icon={calendarOutline} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
