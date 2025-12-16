import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

type PopupProps = {
  setModalVisible: (visible: boolean) => void;
  setModalVisibleTwo: (visible: boolean) => void;
  modalVisibleTwo: boolean;
};

const Popup: React.FC<PopupProps> = ({ setModalVisible, setModalVisibleTwo, modalVisibleTwo }) => {

  const router = useRouter();

  return (
    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>

      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.item} onPress={() => {
            setModalVisible(false)
            router.push('/personalInfo')
          }}>
            <Text style={{ fontSize: 16, fontWeight: 600, paddingLeft: 15 }}>Personal Information</Text>
            <ChevronRight size={20} />
          </TouchableOpacity>

          <Pressable style={styles.item} >
            <Text style={{ fontSize: 16, fontWeight: 600, paddingLeft: 15 }}>Orders History</Text>
            <ChevronRight size={20} />
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={async() => {
              setModalVisible(false)
              await AsyncStorage.removeItem("userUUID")
              router.push('/_welcome/first')
            }}>
            <Text style={styles.textStyle}>Log Out</Text>
          </Pressable>
        </View>
      </View>
    </TouchableWithoutFeedback>

  )
}

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
    backgroundColor: 'white',
    borderRadius: Platform.OS ===
      'ios' ? 40 : 30,
    paddingTop: 24,
    paddingBottom: 15,
    paddingHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
    gap: 10,
  },
  button: {
    borderRadius: 30,
    padding: 10,
    elevation: 2,
    width: '100%',
    height: 55,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center'
  },

  textStyle: {
    color: 'white',
    fontWeight: 600,
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  item: {
    width: '100%',
    height: 55,
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
})

export default Popup
