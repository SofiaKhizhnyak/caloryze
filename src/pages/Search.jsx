import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
  IonItem,
  IonList,
  IonThumbnail,
  IonCardSubtitle,
  IonIcon,
} from "@ionic/react";
import { fastFoodOutline, restaurantOutline } from "ionicons/icons";

const PIXABAY_KEY = "49740266-5bf466adedb64a71dae43ea83";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setResults([]);
    setError("");
  }, [query]);

  const getImage = async (foodName) => {
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(
          foodName
        )}&image_type=photo`
      );
      const data = await response.json();
      return data.hits?.[0]?.previewURL || null;
    } catch {
      return null;
    }
  };
  const searchFoods = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const appId = import.meta.env.VITE_NUTRITIONIX_APP_ID;
      const appKey = import.meta.env.VITE_NUTRITIONIX_APP_KEY;

      const instantRes = await fetch(
        `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(
          searchQuery
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-app-id": appId,
            "x-app-key": appKey,
          },
        }
      );

      if (!instantRes.ok) {
        const errorText = await instantRes.text();
        throw new Error(`API error: ${instantRes.status} - ${errorText}`);
      }

      const instantData = await instantRes.json();
      const common = instantData.common;

      if (!common || common.length === 0) {
        setError("No results found.");
        return;
      }

      const topFoods = common.slice(0, 4);

      const enriched = await Promise.all(
        topFoods.map(async (food) => {
          // Get nutrition info
          const nutriRes = await fetch(
            "https://trackapi.nutritionix.com/v2/natural/nutrients",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-app-id": appId,
                "x-app-key": appKey,
              },
              body: JSON.stringify({ query: food.food_name }),
            }
          );

          let calories = null;
          if (nutriRes.ok) {
            const nutriData = await nutriRes.json();
            calories = nutriData.foods?.[0]?.nf_calories || null;
          }

          const image = await getImage(food.food_name);
          return {
            ...food,
            image,
            nf_calories: calories,
          };
        })
      );

      setResults(enriched);
    } catch (err) {
      console.error("Search error:", err);
      setError(`Failed to search for foods: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => searchFoods(query);

  return (
    <IonPage>
      <IonContent>
        <div className="centered-wrapper">
          <IonCard>
            <IonCardContent>
              <IonCardTitle className="ion-text-center">
                Search Food
              </IonCardTitle>

              <IonCardSubtitle
                className="ion-text-center"
                style={{ color: "#eb3903ff", fontSize: "1rem" }}
              >
                Check food calorie details{" "}
                <IonIcon
                  icon={fastFoodOutline}
                  style={{
                    color: "#eb3903ff",
                    fontSize: "1.4rem",
                    opacity: "0.7",
                  }}
                />
              </IonCardSubtitle>

              <IonInput
                className="custom-input"
                placeholder="e.g. banana"
                value={query}
                onIonInput={(e) => setQuery(e.detail.value)}
                debounce={300}
              />
              <IonButton expand="block" onClick={handleSearch}>
                Search
              </IonButton>

              {loading && (
                <div className="ion-text-center ion-margin-top">
                  <IonSpinner name="dots" />
                </div>
              )}

              {error && (
                <IonText color="danger">
                  <p className="ion-text-center ion-padding">{error}</p>
                </IonText>
              )}
            </IonCardContent>
          </IonCard>

          {results.length > 0 && (
            <IonList>
              {results.map((item, index) => {
                console.log("Food item:", item);
                const foodName = item.food_name;
                const calories = `${item.nf_calories} kcal`;
                const servingQty = item?.serving_qty || "";
                const servingUnit =
                  item.serving_unit?.split("(")[0].trim() || "";

                return (
                  <IonItem key={index}>
                    {item.image ? (
                      <IonThumbnail slot="start">
                        <img src={item.image} alt={foodName} />
                      </IonThumbnail>
                    ) : (
                      <IonThumbnail slot="start" className="icon-thumbnail">
                        <IonIcon
                          icon={restaurantOutline}
                          className="icon-fill"
                        />
                      </IonThumbnail>
                    )}
                    <IonText>
                      <strong
                        style={{
                          color: "orangered",
                          textTransform: "capitalize",
                        }}
                      >
                        {foodName}
                      </strong>
                      {calories && (
                        <div style={{ marginTop: "4px", color: "#333" }}>
                          {servingQty} {servingUnit}:{" "}
                          <span
                            style={{
                              fontWeight: "500",
                            }}
                          >
                            {calories}
                          </span>
                        </div>
                      )}
                    </IonText>
                  </IonItem>
                );
              })}
            </IonList>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Search;
