import React, { useState } from "react";
import {
  IonItem,
  IonIcon,
  IonButton,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonAlert,
  IonContent,
  IonList,
} from "@ionic/react";
import { trashOutline, createOutline, addOutline } from "ionicons/icons";

const FoodItemList = ({
  items,
  onEdit,
  onDelete,
  onDuplicate,
  showToast,
  showErrorToast,
}) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDeleteClick = (index) => {
    setItemToDelete(index);
    setShowDeleteAlert(true);
  };

  const confirmDelete = () => {
    if (itemToDelete !== null && onDelete) {
      onDelete(itemToDelete);
    }
    setShowDeleteAlert(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteAlert(false);
    setItemToDelete(null);
  };

  if (items.length === 0) {
    return (
      <div
        className="empty-state"
        style={{ padding: "1.5rem", textAlign: "center" }}
      >
        <p style={{ color: "#666" }}>No food items added yet.</p>
      </div>
    );
  }

  return (
    <div className="food-list-virtual-container">
      <IonContent className="ion-padding-horizontal-none">
        <IonList>
          {items.map((item, index) => (
            <IonItem key={index} className="food-item">
              <IonGrid>
                <IonRow className="action-buttons-container">
                  <IonCol sizeSm="6">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <IonText className="food-list-text">{item.name}</IonText>

                      <IonText color="medium" className="food-list-calories">
                        {item.calories} kcal
                      </IonText>
                    </div>
                  </IonCol>
                  <IonCol size="4" sizeSm="3" className="ion-text-end">
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      {onEdit && (
                        <IonButton
                          title="Edit item"
                          fill="clear"
                          className="action-button"
                          onClick={() => onEdit(index)}
                          size="small"
                          disabled={showErrorToast || showToast}
                        >
                          <IonIcon slot="icon-only" icon={createOutline} />
                        </IonButton>
                      )}
                      {onDelete && (
                        <IonButton
                          title="Delete item"
                          fill="clear"
                          className="action-button"
                          color="danger"
                          onClick={() => handleDeleteClick(index)}
                          size="small"
                          disabled={showErrorToast || showToast}
                        >
                          <IonIcon slot="icon-only" icon={trashOutline} />
                        </IonButton>
                      )}
                      {onDuplicate && (
                        <IonButton
                          title="Duplicate item"
                          fill="clear"
                          className="action-button"
                          onClick={() => onDuplicate(index)}
                          size="small"
                          color="tertiary"
                          disabled={showErrorToast || showToast}
                        >
                          <IonIcon slot="icon-only" icon={addOutline} />
                        </IonButton>
                      )}
                    </div>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={cancelDelete}
        header="Confirm Deletion"
        message={`Are you sure you want to delete ${
          itemToDelete !== null && items[itemToDelete]
            ? items[itemToDelete].name
            : "this item"
        }?`}
        buttons={[
          {
            text: "Cancel",
            role: "cancel",
            handler: cancelDelete,
          },
          {
            text: "Delete",
            role: "destructive",
            handler: confirmDelete,
          },
        ]}
      />
    </div>
  );
};

export default FoodItemList;
