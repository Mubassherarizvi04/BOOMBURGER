import React, { useContext, useState } from 'react'
import { View, Text, StyleSheet, Pressable, TouchableWithoutFeedback, TouchableOpacity, Platform } from 'react-native'
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '@/context/userDataContext';
import { addOrder } from '@/hooks/addOrder';
import { AddressContext } from '@/context/addressContext';
import { OrderContext } from '@/context/userOrderContext';


type PopupProps = {
    setModalVisible: (visible: boolean) => void;
};

const Payment: React.FC<PopupProps> = ({ setModalVisible }) => {

    const router = useRouter();

    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const { userData } = useContext(UserContext)
    const { address } = useContext(AddressContext)
    const { fetchUserOrders } = useContext(OrderContext)

    const paymentOptions = [
        'Cash On Delivery',
        'UPI',
        'Pay Using Card',
    ];

    const orderData = {
        payment : selectedOption,
        subtotal: userData?.cart.reduce((sum: any, i: any) => sum + i.price * i.quantity , 0),
        total: userData?.cart.reduce((sum: any, i: any) => sum + i.price * i.quantity , 0) + 20,
        items: userData?.cart,
        status: "Pending",
        customerName: userData.name,
        customerEmail: userData.email,
        address: address
    }

    return (
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {paymentOptions.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.optionContainer,
                                selectedOption === option && styles.selectedContainer,
                            ]}
                            onPress={() => setSelectedOption(option)}
                        >
                            <View style={styles.radioCircle}>
                                {selectedOption === option && <View style={styles.selectedRb} />}
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity style={styles.payNow} onPress={() => {
                        setModalVisible(false)
                        addOrder(orderData,fetchUserOrders)
                        router.push('/success')
                    }}>
                        <Text style={{ color: 'white', fontWeight: 600, fontSize: 16 }} >Pay Now $34.00</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}



export default Payment

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,.3)"
    },
    modalView: {
        width: '93%',
        marginHorizontal: 20,
        marginVertical: 5,
        backgroundColor: 'white',
        borderRadius: Platform.OS === 'ios' ? 40 : 30,
        paddingTop: 24,
        paddingBottom: 15,
        paddingHorizontal: 16,
        alignItems: 'center', gap: 10,
        marginBottom: Platform.OS === 'ios' ? 20 : 5,
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
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 15,
        padding: 15,
        // marginBottom: 10,
        backgroundColor: '#fff',
        width:'100%',
    },
    selectedContainer: {
        borderColor: '#000',
        width:'100%',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#000',
    },
    optionText: {
        fontSize: 16,
        color: '#000',
    },
})
