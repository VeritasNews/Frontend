import React from "react";
import { ScrollView, TouchableOpacity, Text, View, StyleSheet } from "react-native";

const CategoryBar = ({ categories, navigation }) => {
  return (
    <View style={styles.categoryContainer}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.categoryScrollView} // Ensure row layout
        showsHorizontalScrollIndicator={false} // Optional, to hide scroll bar
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryButton, category.isActive && styles.activeCategoryButton]}
            onPress={() => navigation.navigate(category.route)}
          >
            <Text
              style={[styles.categoryButtonText, category.isActive && styles.activeCategoryButtonText]}
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
  categoryContainer: {
    marginTop: 16, // Add some space above the category bar
    marginBottom: 16, // Add some space below the category bar
    paddingHorizontal: 10, // Padding to prevent content from touching the edges
  },
  categoryScrollView: {
    flexDirection: "row", // Align the items in a row
    flexWrap: "nowrap", // Ensure items do not wrap to the next line
  },
  categoryButton: {
    backgroundColor: "#f0f0f0", // Light background for the button
    paddingVertical: 8, // Vertical padding for button
    paddingHorizontal: 16, // Horizontal padding for button
    borderRadius: 20, // Rounded corners
    marginRight: 10, // Add space between the buttons
    marginBottom: 8, // Add space below for mobile responsiveness
    alignItems: "center", // Center the text within the button
    justifyContent: "center", // Vertically center text
  },
  activeCategoryButton: {
    backgroundColor: "#007BFF", // Active category button color (blue)
  },
  categoryButtonText: {
    fontSize: 14, // Set the font size for category text
    color: "#333", // Default text color (dark gray)
    textAlign: "center", // Ensure the text is centered within the button
  },
  activeCategoryButtonText: {
    color: "#fff", // White color for active category button text
  },
});

export default CategoryBar;
