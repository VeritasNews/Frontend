import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { getAuthToken } from "../utils/api"; // Import your token util

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const ICON_SIZE = isWeb ? 28 : width > 768 ? 32 : 24;
const TEXT_SIZE = isWeb ? 16 : width > 768 ? 14 : 12;
const PADDING = isWeb ? 18 : width > 768 ? 14 : 10;

const navigationItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/648978f6b0e909dd6f933a5356e32b2aecaba47be9a8082153a35a6daad08dcb", label: "Home", route: "ForYou", protected: false },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f12d22b2f14f09da32d8a825157ca26cbcac720777a45bbbfad3f9403a670a1c", label: "Messages", route: "Messages", protected: true },
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/21e0e1b10fbd9864cedd10e4f6c4c1fa2d8a5602524a7c577066b2def8dc4d46", label: "Profile", route: "Profile", protected: true },
];

const BottomNav = ({ navigation }) => {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    (async () => {
      const token = await getAuthToken();
      setAuthenticated(!!token);
    })();
  }, []);

  const handleNavigation = (route, isProtected) => {
    if (isProtected && !authenticated) {
      navigation.navigate("Login"); // or "GuestWarning" if you have one
    } else {
      navigation.navigate(route);
    }
  };

  return (
    <View style={[styles.navigationBar, isWeb && styles.webNav]}>
      {navigationItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            if (authenticated === null) return; // Prevent interaction before check
            handleNavigation(item.route, item.protected);
          }}
          style={styles.navItem}
        >
          <Image source={{ uri: item.icon }} style={styles.navIcon} />
          <Text style={styles.navText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 0,
    borderTopWidth: 0,
    borderTopColor: "#ddd",
    width: "100%",
  },
  webNav: {
    position: "fixed",
    bottom: 5,
    left: "50%",
    transform: [{ translateX: -width * 0.25 }],
    width: "50%",
    maxWidth: 600,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 20,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 15,
  },
  navIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    resizeMode: "contain",
  },
  navText: {
    fontSize: TEXT_SIZE,
    color: "#333",
    marginTop: 4,
  },
});

export default BottomNav;
