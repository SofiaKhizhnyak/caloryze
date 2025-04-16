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

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch("/api/fatsecret-search", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, max_results: 4 }),
      });

      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.clone().text();
          if (errorData) {
            errorMessage += ` - ${errorData}`;
          }
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const foods = data.foods?.food;

      if (!foods || foods.length === 0) {
        setError("No results found.");
      } else {
        const enriched = await Promise.all(
          (Array.isArray(foods) ? foods : [foods]).map(async (item) => {
            const image = await getImage(item.food_name);
            return { ...item, image };
          })
        );
        setResults(enriched);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError(`Failed to fetch nutrition data: ${err.message}`);
    }

    setLoading(false);
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
          {results && (
            <IonList>
              {results.map((item, index) => {
                const foodName = item.food_name;
                const calories = item.food_description?.split("|")[0].trim();

                return (
                  <IonItem key={index}>
                    {item.image && (
                      <IonThumbnail slot="start">
                        <img src={item.image} alt={foodName} />
                      </IonThumbnail>
                    )}
                    <IonText>
                      <strong style={{ color: "orangered" }}>
                        {foodName}{" "}
                      </strong>{" "}
                      {calories}
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
