import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
} from "react-native";
import { getAuthToken } from "../utils/authAPI";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const isWideWeb = isWeb && width >= 1024;

const ICON_SIZE = 28;
const TEXT_SIZE = 12;

const BottomNav = ({ navigation }) => {
  const [authenticated, setAuthenticated] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const route = useRoute();

  useEffect(() => {
    console.log("BottomNav rendering, isWideWeb:", isWideWeb);
    
    const checkAuth = async () => {
      try {
        const token = await getAuthToken();
        setAuthenticated(!!token);
        console.log("Authentication status:", !!token);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  const navigationItems = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1946/1946488.png",
      label: "Home",
      route: authenticated ? "ForYouPersonalized" : "ForYou",
      protected: false,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/5948/5948565.png",
      label: "Messages",
      route: "Messages",
      protected: true,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/1077/1077063.png",
      label: "Profile",
      route: "Profile",
      protected: true,
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/54/54481.png",
      label: "Search",
      route: "Search",
      protected: false,
    },
  ];

  const handleNavigation = (routeName, isProtected) => {
    setMenuOpen(false);
    if (isProtected && !authenticated) {
      navigation.navigate("Login");
    } else {
      navigation.navigate(routeName);
    }
  };

  if (authenticated === null) {
    return (
      <View style={styles.navigationBar}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isWideWeb) {
    return (
      <>
        <TouchableOpacity
          onPress={() => setMenuOpen(true)}
          style={styles.fabButton}
        >
          <Text style={styles.fabText}>⋮</Text>
        </TouchableOpacity>

        <Modal
          transparent
          visible={menuOpen}
          animationType="fade"
          onRequestClose={() => setMenuOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setMenuOpen(false)}
            activeOpacity={1}
          >
            <View style={styles.webMenu}>
              {navigationItems.map((item, index) => {
                const isActive = route.name === item.route;
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleNavigation(item.route, item.protected)}
                    style={styles.webMenuItem}
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
          </TouchableOpacity>
        </Modal>
      </>
    );
  }

  return (
    <View style={styles.navigationBar}>
      {navigationItems.map((item, index) => {
        const isActive = route.name === item.route;
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleNavigation(item.route, item.protected)}
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
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    width: "100%",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
    height: 60,
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
    marginTop: 2,
  },
  activeText: {
    color: "#a91101",
    fontWeight: "700",
  },
  loadingText: {
    color: "#666",
    fontSize: 14,
  },
  // FAB for wide web
  fabButton: {
    position: "fixed",
    bottom: 20,
    right: 20,
    backgroundColor: "#a91101",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    zIndex: 1000,
  },
  fabText: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  webMenu: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    margin: 20,
    minWidth: 180,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1500,
  },
  webMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
});

export default BottomNav;