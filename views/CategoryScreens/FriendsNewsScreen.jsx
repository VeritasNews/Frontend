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
  { label: "Friends", route: "Friends", isActive: true },
  { label: "Tech", route: "Tech", isActive: false },
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
      title: "Grevcilerin Destek Kazanması",
      content: "Grevin desteği arttıkça daha fazla vatandaş protestolara katılarak, sistemik değişiklikler için baskı yapıyor.",
      date: "20 Aralık 2024",
    },
    {
      title: "İşçiler Daha İyi Koşullar Talep Ediyor",
      content: "Grevciler, daha iyi maaşlar ve çalışma koşulları talep ediyor, bu da ülke genelinde işçi haklarıyla ilgili tartışmaları tetikliyor.",
      image: require("../../assets/image2.jpg"),
      date: "19 Aralık 2024",
    },
    {
      title: "Hükümetin Tutumu",
      content: "Hükümet yetkilileri, kesintilerin sona ermesini ve normale dönülmesini isteyen kararlı bir tutum sergiliyor.",
      date: "18 Aralık 2024",
    },
    {
      title: "Protestocular Dirençle Karşılaşıyor",
      content: "Geniş çapta destek olmasına rağmen, protestocular güvenlik güçlerinden büyük dirençle karşılaşıyor, bu da gerilimin artmasına yol açıyor.",
      image: require("../../assets/image4.jpg"),
      date: "17 Aralık 2024",
    },
    {
      title: "Grevin Ekonomik Etkisi",
      content: "Grevin yerel ekonomiyi etkilemeye başladığı, işletmelerin taşımacılık durmalarından dolayı kayıplar bildirdiği belirtiliyor.",
      image: require("../../assets/image3.jpg"),
      date: "16 Aralık 2024",
    },
    {
      title: "Müzakereler İçin Çağrılar",
      content: "Her iki taraf da müzakerelere ihtiyaç duyulduğu konusunda hemfikir, gelecek hafta başlayan görüşmelerle mevcut kriz çözülmeye çalışılacak.",
      date: "15 Aralık 2024",
    },
    {
      title: "Bahçeli, Öcalan'ı Meclis'te Konuşmaya Çağırıyor: Silah Bırakımını İlan Etsin",
      content: "MHP lideri Bahçeli, Öcalan'ın Meclis'te DEM partisine gelerek terörün sonlandığını ilan etmesini istedi. Bu adımın \"umut hakkı\" yasasıyla Öcalan'ın serbest kalmasının önünü açabileceğini belirtti. Bahçeli, terörle mücadelede ortak aklı ve milli birliği savundu.",
      image: require("../../assets/bahceli.jpg"),
      date: "14 Aralık 2024",
    },
  ];
  
  
  const FriendsNewsScreen = ({ navigation }) => {
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
  
  export default FriendsNewsScreen;
  