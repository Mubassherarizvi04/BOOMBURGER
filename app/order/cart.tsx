import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ChevronRight, Trash } from 'lucide-react-native';
import { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Vibration, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { UserContext } from '@/context/userDataContext';
import { removeCartItem, UpdateCartQuantity } from '@/hooks/updateCartQuantity'
import Image from 'react-native-image-progress';

export const triggerVibration = () => {
    if (Platform.OS === 'ios') {
        // ReactNativeHapticFeedback.trigger("impactMedium", {
        //   enableVibrateFallback: true,
        //   ignoreAndroidSystemSettings: false,
        // });
    } else {
        Vibration.vibrate(50);
    }
};

// 

export default function DetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter()
    const [count, setCount] = useState(1);
    const [loading, setLoading] = useState(false);

    const { userData, fetchUserData } = useContext(UserContext);

    // useEffect(() => {
    //     fetchUserData();
    // }, [])

    const handleQuantityChange = async (itemId: any, change: any) => {
        const updated = await UpdateCartQuantity(itemId, change);
        if (updated) {
            fetchUserData();
        }
    };

    const handleDelete = async (itemId: any) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item from your cart?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        const updated = await removeCartItem(itemId, setLoading);
                        if (updated) {
                            fetchUserData();
                        };
                    },
                },
            ]
        );
    };


    return (
        <SafeAreaView style={styles.container}>
            {
                loading ?
                    <View style={{ width: '100%', height: '100%', position: 'absolute', top: '50%', left: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: 'translate(-50%,-50%)', backgroundColor: 'rgba(0,0,0,.4)', zIndex: 100 }} >
                        <ActivityIndicator size={50} />
                    </View>
                    : ""
            }

            <View style={styles.box}>
                <View style={styles.header} >
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <ChevronLeft size={26} />
                    </TouchableOpacity>
                    <Text style={styles.headtitle} >My Cart ({userData?.cart?.length || 0})</Text>
                    <View style={{ width: 40 }}></View>
                </View>
                {
                    userData.cart?.length === 0 ?
                        <View style={{ width: '100%', height: '70%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 25, fontWeight: 600, color: 'rgba(0,0,0,.2)' }}>No Item</Text>
                        </View>
                        : ''
                }
                <ScrollView style={{ marginTop: 20, height: '100%', paddingHorizontal: 6, paddingBottom: 20 }}>
                    {
                        userData?.cart?.map((data: any, index: any) => {
                            return (


                                <View style={styles.card} key={index} >
                                    {/* image */}
                                    <Image
                                        source={{ uri: data.image }}
                                        style={styles.image}
                                    />

                                    {/* text content */}
                                    <View style={styles.info}>
                                        <Text style={styles.title}>{data.name}</Text>
                                        <Text style={styles.price}>₹{data.price}</Text>
                                    </View>

                                    {/* quantity selector */}
                                    <View style={styles.counter}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                handleQuantityChange(data.id, -1)
                                            }}
                                            style={styles.btn}
                                        >
                                            <Text style={styles.sign}>−</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.count}>{data.quantity}</Text>

                                        <TouchableOpacity
                                            onPress={() => handleQuantityChange(data.id, +1)}
                                            style={styles.btn}
                                        >
                                            <Text style={styles.sign}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <Pressable style={{ marginLeft: 10 }} onPress={() => handleDelete(data.id)}>
                                        <Trash size={25} color='red' />
                                    </Pressable>
                                </View>
                            )
                        })
                    }

                </ScrollView>
            </View>
            <View style={styles.cartContainer} >
                <Text style={{ fontSize: 22, fontWeight: 600, color: 'orange' }}>${userData?.cart?.reduce((sum: any, i: any) => sum + i.price * i.quantity, 0) || 0}</Text>
                <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/checkout')} >
                    <Text style={{ color: 'black', fontSize: 18, fontWeight: 600 }}> Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        flexDirection: "row",
        alignItems: 'flex-end',
        // justifyContent:'flex-end'
    },
    box: {
        height: Platform.OS === 'ios' ? '96%' : '92%',
        backgroundColor: 'white',
        borderBottomEndRadius: 50,
        borderBottomStartRadius: 50,
        position: 'absolute',
        top: 0,
        width: '100%',
        paddingTop: 30,
        overflow: "hidden"
    },
    header: {
        width: '100%',
        paddingHorizontal: 15,
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backBtn: {
        width: 45,
        height: 45,
        backgroundColor: 'rgba(0,0,0,.1)',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headtitle: {
        fontSize: 22,
        // marginTop: Platform.OS === 'ios' ? 20 : 10,
        fontWeight: 600,
    },
    cartContainer: {
        width: '100%',
        height: "11%",
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    cartBtn: {
        // height: 40,
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: 'orange',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },

    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 8,
    },
    info: {
        flex: 1,
        marginLeft: 20,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    price: {
        color: '#f90', // orange
        fontWeight: 'bold',
        // marginTop: 4,
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 50,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    btn: {
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    sign: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    count: {
        fontSize: 18,
        marginHorizontal: 6,
        fontWeight: '500',
    },
});
