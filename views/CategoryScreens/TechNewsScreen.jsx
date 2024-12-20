import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Platform, TouchableOpacity } from "react-native";
import { NavigationItem } from "../../navigation/NavigationItem"; // Import NavigationItem
import { CategoryButton } from "../../components/CategoryButton"; // Import CategoryButton
import { GLOBAL_STYLES } from "../../theme/globalStyles"; // Import global styles
import COLORS from "../../theme/colors"; // Import COLORS
import FONTS from "../../theme/fonts"; // Import FONTS

const VeritasLogo = require("../../assets/set2_no_bg.png"); // Path to your logo image

const categories = [
  { label: "For You Page", route: "ForYou", isActive: false },
  { label: "Friends", route: "Friends", isActive: false },
  { label: "Tech", route: "Tech", isActive: true },
  { label: "Arts", route: "Arts", isActive: false },
  { label: "Scrollable", route: "Scrollable", isActive: false },
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
  
  const articles = [
    {
      title: "AI Breakthrough in Healthcare",
      content: "New AI models can now detect diseases with over 95% accuracy, revolutionizing diagnostics.",
      image: require("../../assets/image5.jpg"),
      date: "December 20, 2024",
    },
    {
      title: "Quantum Computing Milestone",
      content: "Researchers achieve a record-breaking quantum computation speed, opening doors to advanced simulations.",
      //image: require("../../assets/quantum.jpg"),
      date: "December 19, 2024",
    },
    {
      title: "Electric Cars Dominate 2024",
      content: "EVs surpass traditional cars in sales, marking a major shift in the automotive industry.",
      date: "December 18, 2024",
    },
    {
      title: "Meta Unveils AR Glasses",
      content: "Meta launches lightweight AR glasses for seamless virtual experiences.",
      //image: require("../../assets/meta_glasses.jpg"),
      date: "December 17, 2024",
    },
    {
      title: "New Chip Technology Released",
      content: "Tech firms introduce 2nm chips, boosting smartphone performance and efficiency.",
      //image: require("../../assets/chip.jpg"),
      date: "December 16, 2024",
    },
    {
      title: "5G Expands Globally",
      content: "5G networks now cover 80% of the world, enhancing internet speeds and connectivity.",
      image: require("../../assets/image6.jpg"),
      date: "December 15, 2024",
    },
    {
      title: "Türkiye Invests in Tech Hubs",
      content: "Government funds new tech hubs to support AI and robotics innovation in Türkiye.",
      //image: require("../../assets/turkey_tech.jpg"),
      date: "December 14, 2024",
    },
  ];
  
  
  const TechNewsScreen = ({ navigation }) => {
      const renderArticle = (article, index) => {
        const isImageOnSide = article.title === "Workers Demand Better Conditions";  // Check if the image should be on the side
    
        return (
          <View key={index} style={styles.article}>
            <Text style={[styles.articleTitle, article.title === "Growing Support for Strikers" && styles.largeTitle]}>
              {article.title}
            </Text>
            <View
              style={[styles.contentContainer, isImageOnSide && styles.contentContainerRow]}  // Apply special style if the image should be on the side
            >
              {article.image && <Image source={article.image} style={isImageOnSide ? styles.articleImageSide : styles.articleImage} />}
              <View style={styles.horizontalLine} />
              <Text style={styles.articleText}>{article.content}</Text>
            </View>
          </View>
        );
      };
    
      // Divide articles into 2 columns
      const columns = [[], []];
      articles.forEach((article, index) => {
        columns[index % 2].push(renderArticle(article, index));
      });
    
      return (
        <ScrollView contentContainerStyle={styles.container}>
          {/* Line above the header */}
          <View style={styles.headerLine} />
    
          {/* Header with Logo and Title */}
          <View style={styles.header}>
            <Image source={VeritasLogo} style={styles.logo} />
            <Text style={styles.title}>Veritas</Text> {/* Title next to logo */}
            <Text style={styles.date}>December 20, 2024</Text> {/* Date under logo */}
          </View>
    
          {/* Line below the header */}
          <View style={styles.headerLine} />
    
          {/* Categories Bar */}
          <View style={styles.categoryContainer}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.categoryButton, category.isActive && styles.activeCategoryButton]}
                onPress={() => navigation.navigate(category.route)} // Navigate to the respective screen
              >
                <Text
                  style={[styles.categoryButtonText, category.isActive && styles.activeCategoryButtonText]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
    
          <View style={styles.centerContainer}>
            {columns.map((column, columnIndex) => (
              <View key={columnIndex} style={styles.column}>
                {column}
              </View>
            ))}
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
        </ScrollView>
      );
  };
  
  const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
      alignItems: "center",
      padding: 3,
      backgroundColor: "#f4f4f4",
    },
    headerLine: {
      height: 1,
      backgroundColor: "#141413",
      width: "100%",
    },
    header: {
      flexDirection: "row",  // Align logo and title horizontally
      alignItems: "center",  // Vertically center the logo and title
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    logo: {
      width: 60,
      height: 60,
      resizeMode: "contain",
    },
    title: {
      fontSize: 24,
      fontFamily: "OldStandard-Bold",
      color: "#a91101",
      marginLeft: 10,  // Space between logo and title
    },
    date: {
      fontSize: 14,
      fontFamily: "OldStandard",
      color: "#888",
      marginTop: 4,
      marginLeft: 10,  // Space between title and date
    },
    centerContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      width: "100%",
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 10,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    column: {
      flex: 1,
      marginHorizontal: 1.5,
    },
    article: {
      backgroundColor: "#fff",
      borderRadius: 6,
      padding: 8,
      marginBottom: 8,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    articleTitle: {
      fontSize: 16,
      fontFamily: "OldStandard-Bold",
      color: "#333",
    },
    largeTitle: {
      fontSize: 18,
    },
    contentContainer: {
      marginTop: 8,
    },
    contentContainerRow: {
      flexDirection: "row", // Align content in a row when image is on the side
      flexWrap: 'wrap',  // Allow wrapping to prevent overflow
      alignItems: "flex-start",
    },
    articleImage: {
      width: "100%",
      height: undefined,
      aspectRatio: 16 / 9,
      maxHeight: 200,
      borderRadius: 2,
      marginBottom: 8,
      resizeMode: "cover",
    },
    articleImageSide: {
      width: 160,
      height: 100,
      borderRadius: 4,
      marginRight: 16,
      resizeMode: "cover",
      flexShrink: 0,  // Prevent shrinking the image
    },
    articleText: {
      fontSize: 14,
      color: "#555",
      lineHeight: 18,
      flex: 1,  // Allow text to take available space
    },
    horizontalLine: {
      height: 1,
      backgroundColor: "#ccc",
      marginVertical: 8,
    },
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
      marginRight: 2,
      marginLeft: 2,
      marginBottom: 10,
    },
    activeCategoryButton: {
      backgroundColor: COLORS.primary,
    },
    categoryButtonText: {
      fontSize: 14,
      color: "#333",
    },
    activeCategoryButtonText: {
      color: COLORS.white,
    },

  });
  
  export default TechNewsScreen;
  