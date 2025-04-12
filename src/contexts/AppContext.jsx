import React, { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [days, setDays] = useState(() => {
    const storedDays = localStorage.getItem("caloryzeDays");
    return storedDays ? JSON.parse(storedDays) : [];
  });

  const [currentDayId, setCurrentDayId] = useState(() => {
    const storedId = localStorage.getItem("caloryzeCurrentDayId");
    return storedId ? JSON.parse(storedId) : null;
  });

  useEffect(() => {
    localStorage.setItem("caloryzeDays", JSON.stringify(days));
    localStorage.setItem("caloryzeCurrentDayId", JSON.stringify(currentDayId));
  }, [days, currentDayId]);

  // date YYYY-MM-DD
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const getDayByDate = (dateString) =>
    days.find((day) => day.date === dateString) || null;

  const getCurrentDay = () => {
    return days.find((day) => day.id === currentDayId) || null;
  };

  const isTodayTracked = () => {
    const today = getTodayString();
    return days.some((day) => day.date === today);
  };

  const isCurrentDayToday = () => {
    const today = getTodayString();
    const currentDay = getCurrentDay();
    return currentDay?.date === today;
  };

  const startNewDay = (calorieGoal) => {
    const today = getTodayString();
    const newDay = {
      id: Date.now(),
      date: today,
      calorieGoal: parseInt(calorieGoal, 10),
      totalCalories: 0,
      items: [],
    };

    setDays((prev) => [...prev, newDay]);
    setCurrentDayId(newDay.id);
  };

  const addFoodItem = (name, calories) => {
    const caloriesNum = parseInt(calories, 10);
    setDays((prev) =>
      prev.map((day) =>
        day.id === currentDayId
          ? {
              ...day,
              items: [...day.items, { name, calories: caloriesNum }],
              totalCalories: day.totalCalories + caloriesNum,
            }
          : day
      )
    );
  };

  const handleDelete = (index) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === currentDayId) {
          const newItems = [...day.items];
          const deleted = newItems.splice(index, 1)[0];
          return {
            ...day,
            items: newItems,
            totalCalories: day.totalCalories - parseInt(deleted.calories, 10),
          };
        }
        return day;
      })
    );
  };

  const handleEdit = (index, newName, newCalories) => {
    const newCal = parseInt(newCalories, 10);
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === currentDayId) {
          const updatedItems = [...day.items];
          const oldCal = parseInt(updatedItems[index].calories, 10);
          updatedItems[index] = { name: newName, calories: newCal };
          return {
            ...day,
            items: updatedItems,
            totalCalories: day.totalCalories + (newCal - oldCal),
          };
        }
        return day;
      })
    );
  };

  const contextValue = {
    days,
    currentDayId,
    setCurrentDayId,
    getCurrentDay,
    startNewDay,
    addFoodItem,
    handleDelete,
    handleEdit,
    getTodayString,
    getDayByDate,
    isTodayTracked,
    isCurrentDayToday,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
