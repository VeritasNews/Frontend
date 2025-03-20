import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Dimensions } from "react-native";

const categories = [
  { label: "For You", route: "ForYou"},// Platform.OS === "web" ? "MainPage" : "ForYou" },
  { label: "Arkadaşlar", route: "Friends" },
  { label: "Siyaset", route: "Siyaset" },
  { label: "Eğlence", route: "Entertainment" },
  { label: "Scrollable", route: "Scrollable" },
  { label: "Spor", route: "Spor" },
  { label: "Teknoloji", route: "Teknoloji"},
  { label: "Sağlık", route: "Saglik",  },
  { label: "Çevre", route: "Cevre"  },
  { label: "Bilim", route: "Bilim"  },
  { label: "Eğitim", route: "Egitim" },
  { label: "Ekonomi", route: "Ekonomi" },
  { label: "Seyahat", route: "Seyahat" },
  { label: "Moda", route: "Moda" },
  { label: "Kültür", route: "Kultur" },
  { label: "Suç", route: "Suc" },
  { label: "Yemek", route: "Yemek" },
  { label: "Yaşam Tarzı", route: "YasamTarzi" },
  { label: "İş Dünyası", route: "IsDunyasi" },
  { label: "Dünya Haberleri", route: "DunyaHaberleri" },
  { label: "Oyun", route: "Oyun" },
  { label: "Otomotiv", route: "Otomotiv" },
  { label: "Sanat", route: "Sanat" },
  { label: "Tarih", route: "Tarih" },
  { label: "Uzay", route: "Uzay" },
  { label: "İlişkiler", route: "Iliskiler" },
  { label: "Din", route: "Din" },
  { label: "Ruh Sağlığı", route: "RuhSagligi" },
  { label: "Magazin", route: "Magazin" },
];

const screenWidth = Dimensions.get("window").width;

const CategoryBar = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState("For You");

  const handleCategoryPress = (category) => {
    if (activeCategory !== category.label) {
      setActiveCategory(category.label);
      navigation.navigate(category.route);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { minWidth: screenWidth }]} // Ensure it starts from left
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              activeCategory === category.label && styles.activeCategoryButton,
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                activeCategory === category.label && styles.activeCategoryButtonText,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%", // Ensure it spans the full width of the screen
    alignItems: "flex-start", // Align categories to the left
  },
  scrollContainer: {
    flexDirection: "row",
    paddingLeft: 5, // Small padding to ensure left alignment
    paddingVertical: 7,
    alignItems: "center",
  },
  categoryButton: {
    backgroundColor: "#D3D3D3", // Light gray for better visibility
    paddingVertical: 7, // Increase vertical padding
    paddingHorizontal: 10, // Increase horizontal padding
    borderRadius: 20, // Make it more rounded
    marginHorizontal: 2, // Increase spacing for clarity
    borderWidth: 1, // Add border for better separation
    borderColor: "#d4d4d4", // Light border for subtle distinction
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // Add slight shadow for 3D effect
    shadowRadius: 3,
    elevation: 3, // Shadow for Android
  },
  activeCategoryButton: {
    backgroundColor: "#a91101", // Red background for active category
    borderColor: "#8b0d01", // Darker red border for contrast
    shadowOpacity: 0.3, // Increase shadow visibility
    elevation: 5, // More noticeable shadow for Android
  },
  categoryButtonText: {
    fontSize: 15, // Slightly larger text
    color: "#333",
    fontWeight: "600", // Make text bolder for better visibility
  },
  activeCategoryButtonText: {
    color: "#fff", // White text for active category
  },
});

export default CategoryBar;
