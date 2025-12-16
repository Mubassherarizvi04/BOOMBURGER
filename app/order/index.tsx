import Popup from '@/components/profile-pop/popup';
import { FoodContext } from '@/context/foodContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { AudioLines, BadgePlus, Bike, CupSoda, Hamburger, History, ShoppingCart, Trash } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import AiScreen from './details/aiScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/context/userDataContext';


const index = () => {

  const router = useRouter();

  const [address, setAddress] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const [filter, setFilter] = useState<string>('All')
  const [searchText, setSearchText] = useState('');

  const { userData, fetchUserData } = useContext(UserContext)

  const changeFilter = (item: string) => {
    if (item === filter) {
      setFilter('All')
    } else {
      setFilter(item)
    }
  }

  const { foods } = useContext(FoodContext);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const userId = await AsyncStorage.getItem("userUUID")
      if (!userId) {
        router.push("/_welcome/second")
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

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <ActivityIndicator size="large" color="blue" />;
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleTwo, setModalVisibleTwo] = useState(true);
  const [showAiScreen, setShowAiScreen] = useState(false);

  const [filterData, setFilterData] = useState(foods);

  useEffect(() => {
    let data = foods;

    // Category filter
    if (filter !== "All") {
      data = data.filter(
        (item: any) =>
          item.category &&
          item.category.toLowerCase() === filter.toLowerCase()
      );
    }

    // Search filter
    if (searchText.trim() !== "") {
      data = data.filter((item: any) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilterData(data);
  }, [filter, searchText, foods]);

  useEffect(() => {
    
    if (!userData) {
      fetchUserData();
    }
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, position: 'relative' }}>

      {/* bottom tab bar  */}
      <View style={Platform.OS === "ios" ? styles.bottomTabIos : styles.bottomTab} >
        {
          userData?.email === 'developersucks@gmail.com' ?
            <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/addProduct')}>
              <BadgePlus color={'white'} size={28} />
            </TouchableOpacity>
            :
            <View style={styles.bottomTabBtnCont} >

              <TouchableOpacity style={[styles.tabBtn, styles.assistant]} onPress={() => setShowAiScreen(true)}>
                <AudioLines size={25} color='white' />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabBtn} onPress={() => router.push('/cart')}>
                <ShoppingCart size={25} />
              </TouchableOpacity>
            </View>
        }
        <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/orderHistory')}>
          <History size={28} />
        </TouchableOpacity>
      </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Popup setModalVisible={setModalVisible} setModalVisibleTwo={setModalVisibleTwo} modalVisibleTwo={modalVisibleTwo} />
      </Modal>


      {/* -------- ai screen ------  */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAiScreen}
        onRequestClose={() => {
          setShowAiScreen(!showAiScreen);
        }}>
        <AiScreen setShowAiScreen={setShowAiScreen} />
      </Modal>



      <View style={styles.header} >
        <Image
          source={require("../assets/images/logo.png")}
        />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontWeight: 700 }}>Hi, {userData?.name || 'user'}</Text>
          <View style={{ width: 150, overflow: 'hidden', flexDirection: 'row' }}>
            <Text style={{ fontSize: 12, fontWeight: 500, height: 20, width: '100%' }}>
              {address}
            </Text>
            <Icon name="angle-down" size={14} color="#000" solid />
          </View>
        </View>

        <Pressable onPress={() => setModalVisible(true)}>
          <Image
            style={{ width: 35, height: 35, borderRadius: 50, borderWidth: 1 }}
            source={{
              uri: "https://i.pinimg.com/1200x/45/ab/ec/45abec33d2e8717142f9dd6490f6b092.jpg"
            }}
          />
        </Pressable>

      </View>
      <ScrollView>
        <Image
          style={{ marginHorizontal: 'auto', marginTop: 30, width: "92%" }}
          source={require("../assets/images/banner.png")}
        />

        <TextInput style={styles.searchInput}
          placeholder='Search Burger, Drink....'
          onChangeText={setSearchText}
        />

        {/* meal filters  */}
        <ScrollView horizontal style={styles.filterContainer}
          contentContainerStyle={{
            gap: 8,
          }}
        >
          <TouchableOpacity style={filter === 'Burger' ? styles.filterBtnActive : styles.filterBtn} onPress={() => changeFilter('Burger')}>
            <Hamburger color={filter === 'Burger' ? 'orange' : 'black'} />
            <Text style={filter === 'Burger' ? styles.filterTextActive : styles.filterText}>Burger</Text>
          </TouchableOpacity>

          <TouchableOpacity style={filter === 'Fries' ? styles.filterBtnActive : styles.filterBtn} onPress={() => changeFilter('Fries')}>
            <MaterialCommunityIcons name='french-fries' size={30} color={filter === 'Fries' ? 'orange' : 'black'} />
            <Text style={filter === 'Fries' ? styles.filterTextActive : styles.filterText}>Fries</Text>
          </TouchableOpacity>

          <TouchableOpacity style={filter === 'Drink' ? styles.filterBtnActive : styles.filterBtn} onPress={() => changeFilter('Drink')}>
            <CupSoda color={filter === 'Drink' ? 'orange' : 'black'} />
            <Text style={filter === 'Drink' ? styles.filterTextActive : styles.filterText}>Drinks</Text>
          </TouchableOpacity>

          <TouchableOpacity style={filter === 'Combo' ? styles.filterBtnActive : styles.filterBtn} onPress={() => changeFilter('Combo')}>
            <MaterialCommunityIcons name='food' size={25} color={filter === 'Combo' ? 'orange' : 'black'} />
            <Text style={filter === 'Combo' ? styles.filterTextActive : styles.filterText}>Combo</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* meal cards  */}

        <View style={styles.cardContainer}>
          {
            filterData.map((data: any, index: any) => {
              return (
                <TouchableOpacity key={index} style={styles.card} onPress={() => router.push({ pathname: "/details/[id]", params: { id: data.id } })} >
                  <Image
                    source={{ uri: data.image }}
                    style={styles.cardImg}
                  />
                  <View style={{ marginTop: 15, marginLeft: 6 }}>
                    <Text style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>{data.name}</Text>
                    <Text style={{ fontSize: 16, fontWeight: 600, color: 'grey' }}>₹{data.price}</Text>
                  </View>
                  {
                    userData?.email === 'developersucks@gmail.com' ?
                      ''
                      :
                      <View style={styles.addCartBtn}>
                        <Text style={{ textAlign: 'center', color: "white", fontSize: 16, fontWeight: 600 }}>Add To Cart</Text>
                      </View>
                  }
                </TouchableOpacity>
              )
            })
          }

        </View>

      </ScrollView>


    </SafeAreaView >
  )
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFCF7  '
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  searchInput: {
    width: '93%',
    height: 50,
    borderRadius: 30,
    borderWidth: 1.4,
    marginHorizontal: 'auto',
    marginTop: 15,
    paddingHorizontal: 20,
    borderColor: '#BCBCBC'
  },
  filterContainer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    gap: 10,
    overflow: 'scroll',
    marginTop: 10,
    paddingHorizontal: 15
  },
  filterBtn: {
    height: 50,
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
    borderRadius: 30,
    borderColor: '#BCBCBC',
    flexDirection: 'row'
  },
  filterBtnActive: {
    height: 50,
    borderWidth: 1,
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 10,
    borderRadius: 30,
    borderColor: 'orange',
    flexDirection: 'row'
  },
  filterText: {
    fontSize: 16,
    fontWeight: 600,
  },
  filterTextActive: {
    fontSize: 16,
    fontWeight: 600,
    color: 'orange'
  },
  cardContainer: {
    marginTop: 20,
    width: "94%",
    marginHorizontal: "auto",
    // height: '100%',
    marginBottom: 110,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  card: {
    width: '48%',
    height: 'auto',
    borderRadius: 25,
    backgroundColor: 'white',
    padding: 10,
  },
  cardImg: {
    width: '60%',
    height: 100,
    marginHorizontal: 'auto',
    marginTop: 10,
  },
  addCartBtn: {
    width: '100%',
    height: 50,
    backgroundColor: 'orange',
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 15,
  },
  deleteBtn: {
    width: '100%',
    height: 50,
    backgroundColor: 'red',
    borderRadius: 30,
    justifyContent: 'center',
    marginTop: 15,
  },

  bottomTab: {
    position: 'absolute',
    top: '95%',
    left: "50%",
    transform: 'translate(-50%,0)',
    width: 250,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    zIndex: 9999,
    gap: 15
    // borderWidth:1
  },
  bottomTabIos: {
    position: 'absolute',
    top: '100%',
    left: "50%",
    transform: 'translate(-50%,0)',
    width: 250,
    height: 60,
    zIndex: 99999,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 15
    // borderWidth:1
  },
  bottomTabBtnCont: {
    height: 60,
    paddingHorizontal: 4,
    width: 'auto',
    borderRadius: 30,
    boxShadow: "5px 5px 10px rgba(0,0,0,.2), -5px -5px 10px rgba(0,0,0,.2)",
    flexDirection: "row",
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  cartBtn: {
    width: 60,
    height: 60,
    // backgroundColor: 'red',
    borderRadius: 50,
    boxShadow: "5px 5px 10px rgba(0,0,0,.2), -5px -5px 10px rgba(0,0,0,.2)",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2
  },
  addBtn: {
    width: 60,
    height: 60,
    borderRadius: 50,
    boxShadow: "5px 5px 10px rgba(0,0,0,.1), -5px -5px 10px rgba(0,0,0,.1)",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  tabBtn: {
    width: 54,
    height: 54,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  assistant: {
    backgroundColor: 'black'
  },
  loadContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '130%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: "translate(-50%,-50%)",
    zIndex: 100000,
    backgroundColor: 'white'
  }
});
export default index
