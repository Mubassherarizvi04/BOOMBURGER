import { UserContext } from '@/context/userDataContext';
import { OrderContext } from '@/context/userOrderContext';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface OrderItem {
  quantity: any;
  name: string;
  qty: number;
}

interface Customer {
  name: string;
  email: string;
}

interface Order {
  createdAt: string;
  id: string;
  orderNumber: string;
  status: 'Delivered' | 'Pending' | 'Cancelled';
  date: string;
  total: number;
  items: OrderItem[];
  customer: Customer;

}

// const orders: Order[] = [
//   {
//     id: '1',
//     orderNumber: '98745',
//     status: 'Paid',
//     date: 'Oct 29, 2024',
//     total: 478.80,
//     items: [
//       { name: 'Veg Burger', qty: 2 },
//       { name: 'Cheese Fries', qty: 1 },
//       { name: 'Coke', qty: 2 },
//     ],
//     customer: { name: 'Raj Parmar', email: 'developersucks@gmail.com' }
//   },
//   {
//     id: '2',
//     orderNumber: '98654',
//     status: 'Pending',
//     date: 'Oct 28, 2024',
//     total: 325.50,
//     items: [
//       { name: 'Paneer Pizza', qty: 1 },
//       { name: 'Garlic Bread', qty: 2 },
//     ],
//     customer: { name: 'Priya Singh', email: 'priya.singh@example.com' }
//   },
//   {
//     id: '3',
//     orderNumber: '98523',
//     status: 'Paid',
//     date: 'Oct 26, 2024',
//     total: 612.00,
//     items: [
//       { name: 'Masala Dosa', qty: 2 },
//       { name: 'Filter Coffee', qty: 2 },
//       { name: 'Idli Sambar', qty: 1 },
//     ],
//     customer: { name: 'Amit Kumar', email: 'amit.k@example.com' }
//   },
//   {
//     id: '4',
//     orderNumber: '98401',
//     status: 'Cancelled',
//     date: 'Oct 25, 2024',
//     total: 250.00,
//     items: [
//       { name: 'Chicken Biryani', qty: 1 },
//     ],
//     customer: { name: 'Neha Sharma', email: 'neha.sharma@example.com' }
//   },
// ];

const OrderHistoryScreen: React.FC = () => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return '#22C55E';
      case 'Pending':
        return '#F59E0B';
      case 'Cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const router = useRouter();

  const { orders, fetchAllOrders, adminOrder } = useContext(OrderContext)
  const { userData } = useContext(UserContext)
  // console.log('orders',orders)
  // console.log('orders admin', adminOrder)

  if (!orders) {
    return <ActivityIndicator size={35} />
  }

  const formatDate = (inputDate: any): string => {
    let date: Date;

    // 🟢 Firestore Timestamp handle kare
    if (inputDate?.toDate) {
      date = inputDate.toDate();
    }
    // 🟢 String handle kare (remove unwanted spaces/symbols)
    else if (typeof inputDate === "string") {
      // Non-breaking spaces aur special characters clean kar de
      const cleaned = inputDate.replace(/[^\x00-\x7F]/g, " ");
      date = new Date(cleaned);
    }
    // 🟢 Already JS Date object
    else {
      date = new Date(inputDate);
    }

    if (isNaN(date.getTime())) {
      console.warn("⚠️ Invalid date format:", inputDate);
      return "Invalid Date";
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };
  const renderOrderCard = ({ item }: { item: Order }) => (
    <Pressable style={styles.card} onPress={() => router.push({ pathname: "/order/[id]", params: { id: item?.id } })}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <Text style={styles.orderNumber}>Order #{item?.orderNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item?.status) }]}>
          <Text style={styles.statusText}>{item?.status}</Text>
        </View>
      </View>

      {/* Date and Total */}
      <Text style={styles.dateTotal}>
        {formatDate(item?.createdAt)} • ₹{item.total.toFixed(2)}
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Order Items */}
      <View style={styles.itemsSection}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{orderItem?.name}</Text>
            <Text style={styles.itemQty}>x{orderItem?.quantity}</Text>
          </View>
        ))}
      </View>

    </Pressable>
  );

  const [filter, setFilter] = useState("all");
  const [filterData, setFilterData] = useState(orders);

  // Filter orders based on selected tag
  useEffect(() => {
    if (userData?.email === 'developersucks@gmail.com') {
      fetchAllOrders();
      setFilterData(adminOrder)
    }
    else {
      setFilterData(orders)
    }
  }, [])

  const filterDataFunction = (status: any) => {
    setFilter(status)

  }

  useEffect(() => {
    if (userData?.email === 'developersucks@gmail.com') {
      console.log('admin yes')
      const filteredData =
        filter === "all"
          ? adminOrder
          : adminOrder.filter((item: any) => item.status.toLowerCase() === filter.toLowerCase());
      setFilterData(filteredData)
    }
    else {
      console.log('admin no')
      const filteredData =
        filter === "all"
          ? orders
          : orders.filter((item: any) => item.status.toLowerCase() === filter.toLowerCase());
      setFilterData(filteredData)
    }
  },[filter])


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/')} >
          <ChevronLeft size={30} />
        </Pressable>
        {
          userData?.email === 'developersucks@gmail.com' ?
            <Text style={styles.headerTitle}>All Orders</Text>
            :
            <Text style={styles.headerTitle}>Order History</Text>
        }
      </View>
      <View style={styles.filterContainer}>
        {["all", "pending", "delivered", "cancelled"].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterTag,
              filter === status && styles.activeTag, // highlight active tag
            ]}
            onPress={() => filterDataFunction(status)}
          >
            <Text
              style={[
                styles.filterText,
                filter === status && styles.activeText,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {
        filterData.length === 0 ?
          <View style={{ width: '100%', height: '70%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 25, fontWeight: 600, color: 'rgba(0,0,0,.2)' }}>No Order</Text>
          </View>
          :
          <FlatList
            data={filterData}
            renderItem={renderOrderCard}
            keyExtractor={(item) => item?.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    flexDirection: 'row',
    gap: 15
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,.1)',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'capitalize'
  },
  dateTotal: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  itemsSection: {
    marginBottom: 0,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    textTransform: 'capitalize'
  },
  itemQty: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  customerSection: {
    marginTop: 0,
  },
  customerLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  customerName: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 2,
  },
  customerEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  filterTag: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
    backgroundColor: "#fff",
  },
  activeTag: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  filterText: {
    color: "#333",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  activeText: {
    color: "#fff",
  },
});

export default OrderHistoryScreen;
