import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ChevronLeft, MapPin } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import Payment from '@/components/payment-model/payment'
import { AddressContext } from '@/context/addressContext'
import { UserContext } from '@/context/userDataContext'


const Checkout = () => {

    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);

    const { address } = useContext(AddressContext);
    const { userData } = useContext(UserContext);

    const totalPay = userData?.cart.reduce((sum: any, i: any) => sum + i.price * i.quantity , 0) + 20
    const totalQuantity = userData?.cart.reduce((sum: any, i: any) => sum + i.quantity , 0)

    return (
        <SafeAreaView style={styles.container}>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <Payment setModalVisible={setModalVisible} />
            </Modal>

            <View style={styles.header} >
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <ChevronLeft size={26} />
                </TouchableOpacity>
                <Text style={styles.headtitle} >Confirm Order</Text>
                <View style={{ width: 40 }}></View>
            </View>
            <View style={styles.location}>
                <MapPin size={40} />
                <View style={{ paddingRight: 10 }}>
                    <Text style={{ fontSize: 14, fontWeight: 500, color: 'grey' }}>Delivery Address</Text>
                    <Text style={{ fontSize: 16, fontWeight: 600, flexWrap: 'wrap', }}>{address}</Text>
                </View>
            </View>
            <Text style={{ fontSize: 16, fontWeight: 600, marginTop: 15 }} >Items</Text>

            <ScrollView style={styles.itemList}>
                {
                    userData?.cart?.map((data: any, index: any) => {
                        return (
                            <View key={index} style={styles.card}>
                                <Image
                                    source={{ uri: data.image }}
                                    style={styles.image}
                                />
                                <View style={styles.details}>
                                    <Text style={styles.title}>
                                       {data.name} <Text style={styles.qty}>x{data.quantity}</Text>
                                    </Text>
                                    <Text style={styles.price}>₹{data.price*data.quantity}</Text>
                                </View>
                            </View>
                        )
                    })
                }

            </ScrollView>
            <View style={{ marginTop: 'auto' }}>
                <View style={styles.summary} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16, fontWeight: 600, }}>Quantity</Text>
                        <Text style={{ fontSize: 16, fontWeight: 600, }}>{totalQuantity} Item</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16, fontWeight: 600, }}>Subtotal</Text>
                        <Text style={{ fontSize: 16, fontWeight: 600, }}>₹{userData?.cart.reduce((sum: any, i: any) => sum + i.price * i.quantity, 0)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>charges</Text>
                        <Text style={{ fontSize: 16, fontWeight: 600, }}>₹20</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                        <Text style={{ fontSize: 22, fontWeight: 600, textTransform: 'capitalize' }}>Total</Text>
                        <Text style={{ fontSize: 22, fontWeight: 600, }}>₹ {totalPay}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.payNow} onPress={() => setModalVisible(true)}>
                    <Text style={{ color: 'white', fontWeight: 600, fontSize: 16 }} >Pay Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default Checkout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
    },
    header: {
        width: '100%',
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative'
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
        fontWeight: 600,
    },
    location: {
        width: '100%',
        height: 'auto',
        borderWidth: 1,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        gap: 10,
        borderColor: '#adadadff',
        borderRadius: 15,
    },
    itemList: {
        maxHeight: 350,
        marginTop: 15,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginBottom: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 20,
    },
    details: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    qty: {
        fontWeight: '400',
        color: '#444',
    },
    price: {
        marginTop: 4,
        fontSize: 14,
        color: '#666',
    },
    summary: {
        width: '100%',
        height: 'auto',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#BABABA',
        padding: 20,
        gap: 12,
    },
    payNow: {
        width: '100%',
        height: 60,
        backgroundColor: "#004DFF",
        borderRadius: 40,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

})
