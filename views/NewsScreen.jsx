import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import { NavigationItem } from "../navigation/NavigationItem";
import { CategoryButton } from "../components/CategoryButton";
import { GLOBAL_STYLES } from "../theme/globalStyles";
import COLORS from "../theme/colors";
import FONTS from "../theme/fonts";

const categories = [
  { label: "For You Page", isActive: true },
  { label: "Friends", isActive: false },
  { label: "Finance", isActive: false },
  { label: "Arts", isActive: false },
  { label: "Sports", isActive: false },
];

const navigationItems = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/648978f6b0e909dd6f933a5356e32b2aecaba47be9a8082153a35a6daad08dcb?placeholderIfAbsent=true",
    label: "Home",
    isActive: true,
    route: "News",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/f12d22b2f14f09da32d8a825157ca26cbcac720777a45bbbfad3f9403a670a1c?placeholderIfAbsent=true",
    label: "Messages",
    isActive: false,
    route: "Messages",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/21e0e1b10fbd9864cedd10e4f6c4c1fa2d8a5602524a7c577066b2def8dc4d46?placeholderIfAbsent=true",
    label: "Profile",
    isActive: false,
    route: "Profile",
  },
];

export const NewsScreen = ({ navigation }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Categories */}
        <View style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <CategoryButton
              key={index}
              label={category.label}
              isActive={category.isActive}
            />
          ))}
        </View>

        {/* Branding */}
        <View style={styles.brandingContainer}>
          <Text style={GLOBAL_STYLES.brandingTitle}>The Veritas</Text>
          <Text style={GLOBAL_STYLES.brandingDate}>{currentDate}</Text>
        </View>

        {/* Divider */}
        <View style={GLOBAL_STYLES.divider} />

        {/* Articles */}
        <View style={styles.articleContainer}>
          <View style={styles.mainArticle}>
            <Text style={styles.articleTitle}>Lorem Ipsum</Text>
            <Text style={styles.articleText}>
              Nulla nec lectus vel ipsum venenatis ullamcorper et gravida purus.
            </Text>
          </View>
        </View>

        {/* Navigation Bar */}
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    alignItems: "center",
    width: "100%",
    paddingBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    marginTop: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  brandingContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  articleContainer: {
    paddingHorizontal: 14,
  },
  mainArticle: {
    borderWidth: 1,
    borderColor: COLORS.articleBorder,
    borderRadius: 5,
    padding: 20,
    backgroundColor: COLORS.white,
    ...GLOBAL_STYLES.shadow,
  },
  articleTitle: {
    fontSize: FONTS.sizes.regular,
    fontWeight: FONTS.weights.bold,
    color: COLORS.textDefault,
  },
  articleText: {
    fontSize: FONTS.sizes.small,
    color: COLORS.textMuted,
    marginTop: 5,
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    marginTop: 14,
    backgroundColor: COLORS.white,
    borderRadius: 15,
  },
});
