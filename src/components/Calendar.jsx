import React, { useState } from "react";
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonText,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
} from "@ionic/react";
import {
  chevronBackOutline,
  chevronForwardOutline,
  closeOutline,
  sadOutline,
  happyOutline,
} from "ionicons/icons";
import { useAppContext } from "../contexts/AppContext";
import FoodItemList from "./FoodItemList";
import { useRef } from "react";

function Calendar() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthsOfYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { days, currentDayId, getTodayString } = useAppContext();
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const today = getTodayString();

  const prevMonth = () => {
    setCurrentMonth((prevMonth) => {
      if (prevMonth === 0) {
        setCurrentYear((prevYear) => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const nextMonth = () => {
    setCurrentMonth((nextMonth) => {
      if (nextMonth === 11) {
        setCurrentYear((prevYear) => prevYear + 1);
        return 0;
      }
      return nextMonth + 1;
    });
  };

  const daysWithData = days.filter((day) => {
    const date = new Date(day.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const handleDayClick = (dayNum) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(dayNum).padStart(2, "0")}`;
    const dayData = days.find((day) => day.date === formattedDate);

    if (dayData) {
      setSelectedDay(dayData);
      setIsModalOpen(true);
    }

    console.log(dayData);
  };

  const getDayStatus = (dayNum) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(dayNum).padStart(2, "0")}`;

    const dayData = daysWithData.find((day) => day.date === formattedDate);
    const isToday = formattedDate === today;

    if (!dayData) return { hasData: false };

    const isSuccess = dayData.totalCalories <= dayData.calorieGoal;

    const currentDateObj = new Date();
    const dayDate = new Date(formattedDate);
    const isPastDay = dayDate < new Date(currentDateObj.setHours(0, 0, 0, 0));

    return {
      hasData: true,
      isCurrentDay: dayData.id === currentDayId,
      isSuccess,
      isPastDay,
      dayData,
      isToday,
    };
  };

  return (
    <div className="calendar-container ">
      <div className="calendar-header">
        <IonButton
          fill="clear"
          onClick={prevMonth}
          className="nav-button"
          title="Previous month"
        >
          <IonIcon icon={chevronBackOutline} />
        </IonButton>
        <IonCardTitle className="ion-text-center custom-card-title">
          {monthsOfYear[currentMonth]} {currentYear}
        </IonCardTitle>
        <IonButton
          fill="clear"
          onClick={nextMonth}
          className="nav-button"
          title="Next month"
        >
          <IonIcon icon={chevronForwardOutline} />
        </IonButton>
      </div>

      <IonGrid className="calendar-grid" style={{ padding: 0 }}>
        <IonRow className="weekday-header">
          {daysOfWeek.map((day) => (
            <IonCol key={day} className="ion-text-center">
              <IonText color="medium">
                <strong>{day}</strong>
              </IonText>
            </IonCol>
          ))}
        </IonRow>

        {/*  days */}
        <div className="calendar-days">
          {Array(Math.ceil((firstDayOfMonth + daysInMonth) / 7))
            .fill(null)
            .map((_, weekIndex) => (
              <IonRow key={`week-${weekIndex}`}>
                {Array(7)
                  .fill(null)
                  .map((_, dayIndex) => {
                    const dayNum =
                      weekIndex * 7 + dayIndex - firstDayOfMonth + 1;
                    const isValidDay = dayNum > 0 && dayNum <= daysInMonth;

                    const dayStatus = isValidDay
                      ? getDayStatus(dayNum)
                      : { hasData: false };

                    return (
                      <IonCol
                        key={`day-${weekIndex}-${dayIndex}`}
                        className="calendar-day"
                      >
                        {isValidDay ? (
                          <IonButton
                            title="Click to open day summary"
                            fill="clear"
                            color="medium"
                            className={`calendar-button 
                       ${dayStatus.isToday ? "current-day" : ""} 
                       ${
                         dayStatus.hasData && dayStatus.isPastDay
                           ? dayStatus.isSuccess
                             ? "past-day-success"
                             : "past-day-fail"
                           : ""
                       }`}
                            size="small"
                            disabled={!dayStatus.hasData && !dayStatus.isToday}
                            onClick={() =>
                              dayStatus.hasData && handleDayClick(dayNum)
                            }
                          >
                            {dayNum}
                          </IonButton>
                        ) : (
                          //blank cell
                          <div className="calendar-day-inactive"></div>
                        )}
                      </IonCol>
                    );
                  })}
              </IonRow>
            ))}
        </div>
      </IonGrid>

      {/* Modal */}
      <IonModal
        isOpen={isModalOpen}
        onDidDismiss={() => setIsModalOpen(false)}
        className="day-modal"
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle style={{ opacity: 0.6 }}>
              {selectedDay &&
                `${new Date(selectedDay.date).toLocaleDateString("en-GB", {
                  weekday: "long",
                })}, ${new Date(selectedDay.date).toLocaleDateString("en-GB")}`}
            </IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsModalOpen(false)} title="close">
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {selectedDay && (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle className="custom-card-title">
                    Day Summary
                  </IonCardTitle>
                  <IonCardSubtitle>
                    <strong>Goal:</strong> {selectedDay.calorieGoal} calories
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <div>
                    <div style={{ paddingBottom: " 0.3rem" }}>
                      <IonText color="medium">
                        {" "}
                        <strong>Total Consumed:</strong>
                      </IonText>

                      <IonText
                        color={
                          selectedDay.totalCalories > selectedDay.calorieGoal
                            ? "danger"
                            : "success"
                        }
                      >
                        {" "}
                        {selectedDay.totalCalories} calories
                      </IonText>
                    </div>

                    <IonText
                      color={
                        selectedDay.totalCalories > selectedDay.calorieGoal
                          ? "danger"
                          : "success"
                      }
                    >
                      {selectedDay.totalCalories <= selectedDay.calorieGoal
                        ? "You nailed it! "
                        : "It was a rough day, huh? "}

                      <IonIcon
                        icon={
                          selectedDay.totalCalories <= selectedDay.calorieGoal
                            ? happyOutline
                            : sadOutline
                        }
                      />
                    </IonText>
                  </div>

                  <div className="progress-bar-container">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.min(
                          100,
                          (selectedDay.totalCalories /
                            selectedDay.calorieGoal) *
                            100
                        )}%`,
                        backgroundColor:
                          selectedDay.totalCalories > selectedDay.calorieGoal
                            ? "#eb445a"
                            : "#2dd36f",
                      }}
                    ></div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonCardHeader>
                  <IonCardTitle className="custom-card-title">
                    Food Items
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  {selectedDay.items.length === 0 ? (
                    <IonText color="medium">
                      No food items tracked on this day
                    </IonText>
                  ) : (
                    <FoodItemList items={selectedDay.items} />
                  )}
                </IonCardContent>
              </IonCard>
            </>
          )}
        </IonContent>
      </IonModal>
    </div>
  );
}

export default Calendar;
