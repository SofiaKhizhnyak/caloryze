import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonItemDivider,
  IonModal,
  IonHeader,
  IonToolbar,
  IonToast,
  IonTitle,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import {
  closeOutline,
  checkmarkOutline,
  alertCircleOutline,
} from "ionicons/icons";
import ProgressCard from "../components/ProgressCard";
import FoodItemList from "../components/FoodItemList";
import { useAppContext } from "../contexts/AppContext";
import { Redirect } from "react-router";

const Add = () => {
  const {
    addFoodItem,
    getCurrentDay,
    isCurrentDayToday,
    handleDelete,
    handleEdit,
  } = useAppContext();
  const currentDay = getCurrentDay();

  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editFoodName, setEditFoodName] = useState("");
  const [editCalories, setEditCalories] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  if (!isCurrentDayToday() || !currentDay) return <Redirect to="/start" />;

  const { items } = currentDay;

  const handleAddItem = () => {
    if (food.trim() && calories && parseInt(calories) > 0) {
      setShowToast(true);
      addFoodItem(food, calories);
      setFood("");
      setCalories("");
    } else {
      setShowErrorToast(true);
    }
  };

  const handleDuplicate = (index) => {
    const item = items[index];
    addFoodItem(item.name, item.calories);
  };

  const openEditModal = (index) => {
    setEditIndex(index);
    setEditFoodName(items[index].name);
    setEditCalories(items[index].calories.toString());
    setIsEditing(true);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setEditIndex(null);
    setEditFoodName("");
    setEditCalories("");
  };

  const saveEdit = () => {
    if (editFoodName && editCalories && editIndex !== null) {
      handleEdit(editIndex, editFoodName, editCalories);
      closeEditModal();
    }
  };

  return (
    <IonPage>
      <IonContent className="tab-content">
        <div className="centered-wrapper">
          <IonCard>
            <div className="add-header">
              <IonCardTitle color="dark" className="add-card-title">
                Log your food
              </IonCardTitle>
              <ProgressCard />
            </div>
            <IonItem className="custom-input-item">
              <IonLabel
                position="stacked"
                className="input-ion-label"
                style={{
                  color: "#e34400ff",
                  marginBottom: "2px",
                }}
              >
                Food name:
              </IonLabel>
              <IonInput
                required
                fill="outline"
                type="text"
                className="custom-input"
                value={food}
                disabled={showErrorToast || showToast}
                onIonChange={(e) => setFood(e.detail.value)}
              ></IonInput>
              <IonLabel
                className="input-ion-label"
                position="stacked"
                style={{
                  color: "#e34400ff",
                  marginBottom: "2px",
                }}
              >
                Amount of calories:
              </IonLabel>
              <IonInput
                required
                min={1}
                fill="outline"
                className="custom-input"
                type="number"
                disabled={showErrorToast || showToast}
                value={calories}
                onIonChange={(e) => setCalories(e.detail.value)}
              ></IonInput>
            </IonItem>
            <IonButton
              className="custom-button"
              expand="block"
              onClick={handleAddItem}
              disabled={showErrorToast || showToast}
            >
              Add
            </IonButton>

            <>
              <p className="food-items-header">Food items</p>
              <IonItemDivider className="custom-divider" />
            </>

            <FoodItemList
              items={items}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              showErrorToast={showErrorToast}
              showToast={showToast}
            />
          </IonCard>
        </div>

        {/* Edit Modal */}

        <IonModal
          isOpen={isEditing}
          onDidDismiss={closeEditModal}
          className="edit-modal"
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Food Item</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={closeEditModal}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel
                position="stacked"
                className="input-ion-label"
                style={{ color: "#e34400ff" }}
              >
                Food name:
              </IonLabel>
              <IonInput
                value={editFoodName}
                onIonChange={(e) => setEditFoodName(e.detail.value)}
                fill="outline"
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel
                className="input-ion-label"
                position="stacked"
                style={{ color: "#e34400ff" }}
              >
                Amount of calories:
              </IonLabel>
              <IonInput
                type="number"
                value={editCalories}
                onIonChange={(e) => setEditCalories(e.detail.value)}
                fill="outline"
              ></IonInput>
            </IonItem>
            <IonGrid style={{ marginTop: "1rem" }}>
              <IonRow>
                <IonCol>
                  <IonButton
                    expand="block"
                    onClick={closeEditModal}
                    color="medium"
                  >
                    Cancel
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton expand="block" onClick={saveEdit} color="primary">
                    <IonIcon icon={checkmarkOutline} slot="start" />
                    Save
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonContent>
        </IonModal>
      </IonContent>

      <IonToast
        position="middle"
        icon={checkmarkOutline}
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Food item successfully added to the list!"
        duration={1000}
        color="success"
      />
      <IonToast
        position="middle"
        icon={alertCircleOutline}
        isOpen={showErrorToast}
        onDidDismiss={() => setShowErrorToast(false)}
        message="You must fill the item name and the amount of calories"
        duration={2000}
        color="danger"
      />
    </IonPage>
  );
};
export default Add;
