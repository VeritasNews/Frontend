import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native"; // ✅ Added

const categories = [
  { label: "For You", route: "ForYou" },
  { label: "Arkadaşlar", route: "FriendsNews" },
  { label: "Siyaset", route: "Siyaset" },
  { label: "Eğlence", route: "Entertainment" },
  { label: "Scrollable", route: "Scrollable" },
  { label: "Spor", route: "Spor" },
  { label: "Teknoloji", route: "Teknoloji" },
  { label: "Sağlık", route: "Saglik" },
  { label: "Çevre", route: "Cevre" },
  { label: "Bilim", route: "Bilim" },
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
  const route = useRoute(); // ✅ Use route.name to determine active tab

  const handleCategoryPress = (category) => {
    if (route.name !== category.route) {
      navigation.navigate(category.route);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContainer, { minWidth: screenWidth }]}
      >
        {categories.map((category, index) => {
          const isActive = route.name === category.route; // ✅ Use current route
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                isActive && styles.activeCategoryButton,
              ]}
              onPress={() => handleCategoryPress(category)}
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  isActive && styles.activeCategoryButtonText,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  scrollContainer: {
    flexDirection: "row",
    paddingLeft: 5,
    paddingVertical: 7,
    alignItems: "center",
  },
  categoryButton: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: "#d4d4d4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  activeCategoryButton: {
    backgroundColor: "#a91101",
    borderColor: "#8b0d01",
    shadowOpacity: 0.3,
    elevation: 5,
  },
  categoryButtonText: {
    fontSize: 15,
    color: "#333",
    fontWeight: "600",
  },
  activeCategoryButtonText: {
    color: "#fff",
  },
});

export default CategoryBar;
