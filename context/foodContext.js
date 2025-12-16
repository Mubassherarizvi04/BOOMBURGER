import { db } from "@/firebase/firebase.config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
 // apna firebaseConfig path sahi rakhna

export const FoodContext = createContext();

const FoodProvider = ({ children }) => {

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "foods"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const foodData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoods(foodData);
      console.log('food data fetched')
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FoodContext.Provider value={{ foods, loading }}>
      {children}
    </FoodContext.Provider>
  );
};

export default FoodProvider
