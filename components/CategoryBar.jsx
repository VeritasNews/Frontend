import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { getUserProfile, getAuthToken } from "../utils/authAPI";

const screenWidth = Dimensions.get("window").width;

const CategoryBar = ({ navigation }) => {
  const [sortedCategories, setSortedCategories] = useState([]);
  const route = useRoute();

  useEffect(() => {
    const fetchAndSortCategories = async () => {
      try {
        const token = await getAuthToken();
        const isLoggedIn = !!token;

        const categories = [
          { label: "For You", route: isLoggedIn ? "ForYouPersonalized" : "ForYou" },
          { label: "Arkadaşlar", route: "FriendsNews" },
          { label: "Siyaset", route: "Siyaset" },
          { label: "Eğlence", route: "Entertainment" },
          { label: "Haber Akışı", route: "Scrollable" },
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

        if (!isLoggedIn) {
          setSortedCategories(categories);
          return;
        }

        const user = await getUserProfile();
        const preferred = user.preferredCategories || [];

        const fixed = ["For You", "Arkadaşlar"];
        const preferredSet = new Set(preferred);
        const fixedSet = new Set(fixed);

        const preferredSorted = categories.filter(
          (cat) => preferredSet.has(cat.label) && !fixedSet.has(cat.label)
        );

        const nonPreferred = categories.filter(
          (cat) => !preferredSet.has(cat.label) && !fixedSet.has(cat.label)
        );

        const finalSorted = [
          categories.find((cat) => cat.label === "For You"),
          categories.find((cat) => cat.label === "Arkadaşlar"),
          ...preferredSorted,
          ...nonPreferred,
        ];

        setSortedCategories(finalSorted);
      } catch (err) {
        console.error("❌ Error fetching categories:", err);
        setSortedCategories([]); // fallback to empty
      }
    };

    fetchAndSortCategories();
  }, []);

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
        {sortedCategories.map((category, index) => {
          const isActive = route.name === category.route;
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
    paddingVertical: 7,
    alignItems: "center",       // ✅ aligns buttons vertically
    justifyContent: "center",   // ✅ optional: centers items horizontally if space allows
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
