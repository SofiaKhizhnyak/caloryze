import "./styles/index.css";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
} from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";
import {
  addOutline,
  calendarOutline,
  listOutline,
  logOutOutline,
  searchOutline,
} from "ionicons/icons";
import Start from "./pages/Start";
import Add from "./pages/Add";
import History from "./pages/History";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Search from "./pages/Search";
import PrivateRoute from "./components/PrivateRoute";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
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
/* 
import "@ionic/react/css/palettes/dark.always.css";
import "@ionic/react/css/palettes/dark.class.css";
import "@ionic/react/css/palettes/dark.system.css"; */
import "./theme/variables.css";
import { useAppContext } from "./contexts/AppContext";
import { useAuth } from "./contexts/AuthContext";

setupIonicReact();

const App = () => {
  const { days, isCurrentDayToday } = useAppContext();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <IonApp>
      <IonReactRouter>
        <IonHeader>
          <IonToolbar>
            <IonTitle
              style={{
                fontSize: "2.2rem",
                fontWeight: "700",
                color: "#e03901",
                padding: "0 0 0 5%",
              }}
            >
              Calo
              <span
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "300",
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

            {currentUser && (
              <IonButton
                title="Logot"
                style={{ fontSize: 18 }}
                fill="clear"
                slot="end"
                className="logout-button"
                onClick={handleLogout}
              >
                <IonIcon icon={logOutOutline} />
              </IonButton>
            )}
          </IonToolbar>
        </IonHeader>
        <IonTabs>
          <IonRouterOutlet>
            <PrivateRoute exact path="/start" component={Start} />
            <PrivateRoute exact path="/add" component={Add} />
            <PrivateRoute path="/history" component={History} />
            <PrivateRoute exact path="/search" component={Search} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />

            <Route exact path="/">
              <Redirect to="/start" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/start" aria-label="Start Page">
              <IonIcon aria-hidden="true" icon={addOutline} />
            </IonTabButton>
            <IonTabButton
              aria-label="Add Items Page"
              tab="tab2"
              href="/add"
              disabled={!isCurrentDayToday()}
            >
              <IonIcon aria-hidden="true" icon={listOutline} />
            </IonTabButton>
            <IonTabButton
              tab="tab3"
              href="/history"
              disabled={days.length < 1}
              aria-label="History Page"
            >
              <IonIcon aria-hidden="true" icon={calendarOutline} />
            </IonTabButton>
            <IonTabButton tab="tab4" href="/search" aria-label="Search Page">
              <IonIcon aria-hidden="true" icon={searchOutline} />
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
