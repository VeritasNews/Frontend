import React, { useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Add this if using Ionicons
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import SearchBarWithResults from "../../components/SearchBarWithResults";

const NotificationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.wrapper}>
        <SearchBarWithResults />

      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.noNotificationsContainer}>
          <Ionicons name="notifications-off" size={50} color="#a91101" />
          <Text style={styles.noNotificationsText}>You do not have any notifications</Text>
        </View>
      </ScrollView>

      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 80, // To make room for the BottomNav
    backgroundColor: "white",
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  noNotificationsText: {
    fontSize: 18,
    color: "#a91101",
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
  },
});

export default NotificationScreen;
