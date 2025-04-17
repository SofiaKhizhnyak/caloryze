import React, { useEffect, useState } from "react";
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
import { fastFoodOutline } from "ionicons/icons";

const PIXABAY_KEY = "49740266-5bf466adedb64a71dae43ea83";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reset results and error when query changes
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

  const fetchNutritionData = async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const appId = import.meta.env.VITE_NUTRITIONIX_APP_ID;
      const appKey = import.meta.env.VITE_NUTRITIONIX_APP_KEY;

      const response = await fetch(
        "https://trackapi.nutritionix.com/v2/natural/nutrients",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-app-id": appId,
            "x-app-key": appKey,
          },
          body: JSON.stringify({ query: searchQuery }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      if (!data.foods || data.foods.length === 0) {
        setError("No results found.");
        return [];
      }

      // Enrich the food data with images
      const enrichedFoods = await Promise.all(
        data.foods.map(async (food) => {
          const image = await getImage(food.food_name);
          return { ...food, image };
        })
      );

      return enrichedFoods;
    } catch (err) {
      console.error("Nutrition fetch error:", err);
      setError(`Failed to fetch nutrition info: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const foodResults = await fetchNutritionData(query);
    setResults(foodResults);
  };

  const handleSelectFood = async (foodName) => {
    const foodResults = await fetchNutritionData(foodName);
    setResults(foodResults);
  };

  return (
    <IonPage>
      <IonContent>
        <div className="centered-wrapper">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle className="ion-text-center">
                Search Food
              </IonCardTitle>
              <IonCardSubtitle
                className="ion-text-center"
                style={{ color: "#eb3903ff", fontSize: "1rem" }}
              >
                Enter a food to get its calorie details{" "}
                <IonIcon
                  icon={fastFoodOutline}
                  style={{
                    color: "#eb3903ff",
                    fontSize: "1.4rem",
                    opacity: "0.7",
                  }}
                />
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
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
              {results.map((item, index) => (
                <IonItem key={index}>
                  {item.image && (
                    <IonThumbnail slot="start">
                      <img src={item.image} alt={item.food_name} />
                    </IonThumbnail>
                  )}
                  <IonText>
                    <strong style={{ color: "orangered" }}>
                      {item.food_name}
                    </strong>
                    <div style={{ marginTop: "4px", color: "#333" }}>
                      {item.nf_calories} kcal
                    </div>
                  </IonText>
                </IonItem>
              ))}
            </IonList>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}

export default Search;
