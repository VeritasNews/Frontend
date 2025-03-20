import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

const categories = [
  {
    label: "For You Page",
    route: Platform.OS === "web" ? "MainPage" : "ForYou", // ✅ Dynamically set route
    isActive: true,
  },
  { label: "Friends", route: "Friends", isActive: false },
  { label: "Tech", route: "Tech", isActive: false },
  { label: "Arts", route: "Arts", isActive: false },
  { label: "Scrollable", route: "Scrollable", isActive: false },
];

const CategoryBar = ({ navigation }) => {
  return (
    <View style={styles.categoryContainer}>
      {categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryButton,
            category.isActive && styles.activeCategoryButton,
          ]}
          onPress={() => navigation.navigate(category.route)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              category.isActive && styles.activeCategoryButtonText,
            ]}
          >
            {category.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    flexDirection: "row",
    marginTop: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  categoryButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeCategoryButton: {
    backgroundColor: "#a91101",
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#333",
  },
  activeCategoryButtonText: {
    color: "#fff",
  },
});

export default CategoryBar;
