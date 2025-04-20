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
import { getAuthToken } from "../utils/api";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

const ICON_SIZE = isWeb ? 24 : width > 768 ? 28 : 24;
const TEXT_SIZE = isWeb ? 14 : width > 768 ? 13 : 11;

const navigationItems = [
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1946/1946488.png", // Home icon
    label: "Home",
    route: "ForYou",
    protected: false,
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/5948/5948565.png", // Messages icon
    label: "Messages",
    route: "Messages",
    protected: true,
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/1077/1077063.png", // Profile icon
    label: "Profile",
    route: "Profile",
    protected: true,
  },
  {
    icon: "https://cdn-icons-png.flaticon.com/512/54/54481.png", // Search icon (✅ fixed)
    label: "Search",
    route: "Search",
    protected: false,
  },
];

const BottomNav = ({ navigation }) => {
  const [authenticated, setAuthenticated] = useState(null);
  const route = useRoute();

  useEffect(() => {
    (async () => {
      const token = await getAuthToken();
      setAuthenticated(!!token);
    })();
  }, []);

  const handleNavigation = (routeName, isProtected) => {
    if (isProtected && !authenticated) {
      navigation.navigate("Login");
    } else {
      navigation.navigate(routeName);
    }
  };

  return (
    <View style={[styles.navigationBar, isWeb && styles.webNav]}>
      {navigationItems.map((item, index) => {
        const isActive = route.name === item.route;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              if (authenticated === null) return;
              handleNavigation(item.route, item.protected);
            }}
            style={styles.navItem}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: item.icon }}
              style={[
                styles.navIcon,
                isActive && { tintColor: "#a91101" },
              ]}
            />
            <Text style={[styles.navText, isActive && styles.activeText]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    width: "100%",
  },
  webNav: {
    position: "fixed",
    bottom: 5,
    left: "50%",
    transform: [{ translateX: -width * 0.25 }],
    width: "50%",
    maxWidth: 600,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    resizeMode: "contain",
    tintColor: "#666",
  },
  navText: {
    fontSize: TEXT_SIZE,
    color: "#666",
    marginTop: 3,
  },
  activeText: {
    color: "#a91101",
    fontWeight: "bold",
  },
});

export default BottomNav;
