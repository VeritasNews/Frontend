import React from "react";
import { View, ScrollView, Image, Text, StyleSheet } from "react-native";
import { NavigationItem } from "./components/NavigationItem";
import { CategoryButton } from "./components/CategoryButton";

const categories = [
  { label: "For You Page", isActive: true },
  { label: "Friends", isActive: false },
  { label: "Finance", isActive: false },
  { label: "Arts", isActive: false },
  { label: "Sports", isActive: false },
];

const navigationItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/648978f6b0e909dd6f933a5356e32b2aecaba47be9a8082153a35a6daad08dcb?placeholderIfAbsent=true&apiKey=0365a5635f924c9f9324f034897b8077",
    label: "Home",
    isActive: true,
    route: "News",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f12d22b2f14f09da32d8a825157ca26cbcac720777a45bbbfad3f9403a670a1c?placeholderIfAbsent=true&apiKey=0365a5635f924c9f9324f034897b8077",
    label: "Messages",
    isActive: false,
    route: "Messages",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/21e0e1b10fbd9864cedd10e4f6c4c1fa2d8a5602524a7c577066b2def8dc4d46?placeholderIfAbsent=true&apiKey=0365a5635f924c9f9324f034897b8077",
    label: "Profile",
    isActive: false,
    route: "Profile",
  },
];

export const NewsScreen = ({ navigation }) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusBar}>
            <Text style={styles.timeText}>14:42</Text>
          </View>
          <View style={styles.headerIcons}>
          </View>
        </View>

        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              label={category.label}
              isActive={category.isActive}
            />
          ))}
        </View>

        <View style={styles.brandingContainer}>
          <Text style={styles.brandingTitle}>The Veritas</Text>
          <Text style={styles.brandingDate}>Friday, November 22, 2024</Text>
        </View>

        <View style={styles.contentDivider} />

        <View style={styles.articleContainer}>
          <View style={styles.mainArticle}>
            <Text style={styles.articleTitle}>Lorem Ipsum</Text>
            <Text style={styles.articleText}>
              Nulla nec lectus vel ipsum venenatis ullamcorper et gravida purus.
            </Text>
          </View>
        </View>

        <View style={styles.navigationBar}>
          {navigationItems.map((item, index) => (
            <NavigationItem
              key={index}
              icon={item.icon}
              label={item.label}
              isActive={item.isActive}
              onPress={() => navigation.navigate(item.route)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    paddingBottom: 6,
  },
  header: {
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statusBar: {
    justifyContent: "center",
  },
  timeText: {
    color: "#333",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.24,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  signalIcon: {
    width: 17,
    height: 10,
  },
  wifiIcon: {
    width: 15,
    height: 11,
  },
  batteryIcon: {
    width: 25,
    height: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    marginTop: 4,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  brandingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  brandingTitle: {
    color: "rgba(169, 17, 1, 1)",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  brandingDate: {
    color: "rgba(0, 0, 0, 0.50)",
    fontSize: 12,
  },
  contentDivider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    marginVertical: 4,
  },
  articleContainer: {
    padding: 14,
  },
  mainArticle: {
    borderWidth: 1,
    borderColor: "rgba(193, 179, 179, 0.6)",
    borderRadius: 3,
    padding: 20,
  },
  articleTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  articleText: {
    fontSize: 10,
    marginTop: 5,
  },
  secondaryArticle: {
    marginTop: 7,
  },
  secondaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    padding: 13,
  },
  articleImage: {
    width: "100%",
    height: 150,
    marginTop: 15,
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 15,
    padding: 12,
    marginTop: 14,
    backgroundColor: "#fff",
  },
});
