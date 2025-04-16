import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "./AuthContext";

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [days, setDays] = useState([]);
  const [currentDayId, setCurrentDayId] = useState(null);
  const [loading, setLoading] = useState(true);

  const getTodayString = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!currentUser) {
      setDays([]);
      setCurrentDayId(null);
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, "days"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userDays = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDays(userDays);

      const today = getTodayString();
      const todayDoc = userDays.find((day) => day.date === today);
      if (todayDoc) setCurrentDayId(todayDoc.id);

      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

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

  const startNewDay = async (calorieGoal) => {
    const today = getTodayString();
    const newDay = {
      date: today,
      calorieGoal: parseInt(calorieGoal, 10),
      totalCalories: 0,
      items: [],
      userId: currentUser.uid,
    };
    setDays((prev) => [...prev, newDay]);
    const docRef = await addDoc(collection(db, "days"), newDay);
    setCurrentDayId(docRef.id);
  };

  const addFoodItem = async (name, calories) => {
    const dayRef = doc(db, "days", currentDayId);
    const day = getCurrentDay();
    const caloriesNum = parseInt(calories, 10);
    const updatedItems = [...day.items, { name, calories: caloriesNum }];

    await updateDoc(dayRef, {
      items: updatedItems,
      totalCalories: day.totalCalories + caloriesNum,
    });
  };

  const handleDelete = async (index) => {
    const day = getCurrentDay();
    const dayRef = doc(db, "days", currentDayId);
    const newItems = [...day.items];
    const deleted = newItems.splice(index, 1)[0];

    await updateDoc(dayRef, {
      items: newItems,
      totalCalories: day.totalCalories - parseInt(deleted.calories, 10),
    });
  };

  const handleEdit = async (index, newName, newCalories) => {
    const day = getCurrentDay();
    const dayRef = doc(db, "days", currentDayId);
    const updatedItems = [...day.items];
    const oldCal = parseInt(updatedItems[index].calories, 10);
    const newCal = parseInt(newCalories, 10);
    updatedItems[index] = { name: newName, calories: newCal };

    await updateDoc(dayRef, {
      items: updatedItems,
      totalCalories: day.totalCalories + (newCal - oldCal),
    });
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
    loading,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
