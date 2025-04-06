import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { CategoryButton } from "./CategoryButton";
import { useRoute } from '@react-navigation/native';

const categories = [
  { label: "For You", route: "ForYou"},
  { label: "Arkadaşlar", route: "Friends" },
  { label: "Siyaset", route: "Siyaset" },
  { label: "Eğlence", route: "Entertainment" },
  { label: "Scrollable", route: "Scrollable" },
  { label: "Spor", route: "Spor" },
  { label: "Teknoloji", route: "Teknoloji"},
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

const CategoryBar = ({ navigation }) => {
  const route = useRoute();
  const currentRouteName = route.name;

  const handleCategoryPress = (category) => {
    navigation.navigate(category.route);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer} // Remove minWidth constraint
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.categoryButton,
              currentRouteName === category.route && styles.activeCategoryButton,
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                currentRouteName === category.route && styles.activeCategoryButtonText,
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
    width: "100%",
  },
  scrollContainer: {
    flexDirection: "row",
    paddingLeft: 5,
    paddingVertical: 7,
    alignItems: "center",
  },
  buttonContainer: {
    marginRight: 8,
  }
});

export default CategoryBar;