import { View, Text } from 'react-native'
import React, { createContext, useEffect, useState } from 'react'
import * as Location from 'expo-location';

export const AddressContext = createContext();

const AddressContextProvider = ({ children }) => {

    const [address, setAddress] = useState(null);
    const [errorMsg, setErrorMsg] = useState ('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            // Reverse geocode → lat/long se address
            let geo = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            // geo[0] me address info hoti hai
            if (geo.length > 0) {
                const place = geo[0];
                setAddress(`${place.name}, ${place.city}, ${place.region}`);
            }
        })();
    }, []);

    return (
        <AddressContext.Provider value={{address,errorMsg}}>
            {children}
        </AddressContext.Provider>
    )
}

export default AddressContextProvider
