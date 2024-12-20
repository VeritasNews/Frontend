import React from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';import { NavigationItem } from "../../navigation/NavigationItem"; // Import NavigationItem
import { CategoryButton } from "../../components/CategoryButton"; // Import CategoryButton
import { GLOBAL_STYLES } from "../../theme/globalStyles"; // Import global styles
import COLORS from "../../theme/colors"; // Import COLORS
import FONTS from "../../theme/fonts"; // Import FONTS

const VeritasLogo = require("../../assets/set2_no_bg.png"); // Path to your logo image

const categories = [
  { label: "For You Page", route: "ForYou", isActive: true },
  { label: "Friends", route: "Friends", isActive: false },
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
    title: "Bahçeli, Öcalan'ı Mecliste Konuşmaya Çağırıyor: Silah Bırakımını İlan Etmeli",
    content: "Bahçeli, Öcalan'ı Meclis'te DEM grubunda silahları bırakıp terörün sonunu ilan etmeye çağırdı.  \"Umut Hakkı\"ndan yararlanma teklifini de gündeme getirdi.",
    image: require("../../assets/bahceli.jpg"),
    date: "December 20, 2024", // Add date
  },
  {
    title: "Erdoğan, Sudan Egemenlik Konseyi Başkanı ile Görüştü",
    content: "Cumhurbaşkanı Erdoğan, Sudan Egemenlik Konseyi Başkanı Burhan ile görüştü.  Görüşmede Türkiye-Sudan ilişkileri, bölgesel konular ve Türkiye'nin Somali-Etiyopya anlaşmazlığındaki rolü ele alındı. Erdoğan, Sudan-BAE ihtilafında da arabuluculuk teklif etti.",
    date: "December 18, 2024", // Add date
  },
  {
    title: "2026 Dünya Kupası Avrupa Elemeleri'nde Türkiye'nin Rakipleri Belli Oldu",
    content: "2026 Dünya Kupası Avrupa Elemeleri'nde A Milli Takım, E Grubu'nda İspanya-Hollanda maçının galibi, Gürcistan ve Bulgaristan ile mücadele edecek.  Grup maçları Eylül 2025'te başlayacak.",
    image: require("../../assets/image2.jpg"),
    date: "December 19, 2024", // Add date
  },
  
  {
    title: "Türkiye-ABD Dışişleri Bakanları Görüşmesi",
    content: "Türkiye Dışişleri Bakanı Hakan Fidan ve ABD Dışişleri Bakanı Antony Blinken, 19 Aralık 2024 tarihinde Ankara'da bir araya geldi. Görüşmede Suriye ve Gazze'deki durum ele alındı.",
    image: require("../../assets/image1.jpg"),
    date: "December 17, 2024", // Add date
  },
  {
    title: "Economic Impact of Strikes",
    content: "The strikes have begun to affect the local economy, with businesses reporting losses as transportation halts.",
    image: require("../../assets/image3.jpg"),
    date: "December 16, 2024", // Add date
  },
  {
    title: "Calls for Negotiation",
    content: "Both sides agree on the need for negotiation, with talks scheduled to begin next week to resolve the ongoing crisis.",
    date: "December 15, 2024", // Add date
  },
  {
    title: "Bahçeli, Öcalan'ı Meclis'te Konuşmaya Çağırıyor: Silah Bırakımını İlan Etsin",
    content: "MHP lideri Bahçeli, Öcalan'ın Meclis'te DEM partisine gelerek terörün sonlandığını ilan etmesini istedi. Bu adımın \"umut hakkı\" yasasıyla Öcalan'ın serbest kalmasının önünü açabileceğini belirtti. Bahçeli, terörle mücadelede ortak aklı ve milli birliği savundu.",
    image: require("../../assets/bahceli.jpg"),
    date: "December 14, 2024", // Add date
  },
];

const MainPage = ({ navigation }) => {
  const renderArticle = (article, index) => {
    const isImageOnSide = article.title === "Workers Demand Better Conditions"; // Check if the image should be on the side

    return (
      <View key={index} style={styles.article}>
        <Text
          style={[
            styles.articleTitle,
            article.title === "Growing Support for Strikers" && styles.largeTitle,
          ]}
        >
          {article.title}
        </Text>
        <View
          style={[
            styles.contentContainer,
            isImageOnSide && styles.contentContainerRow,
          ]} // Apply special style if the image should be on the side
        >
          {article.image && (
            <Image
              source={article.image}
              style={
                isImageOnSide ? styles.articleImageSide : styles.articleImage
              }
            />
          )}
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
    <View style={{ flex: 1 }}>
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
              style={[
                styles.categoryButton,
                category.isActive && styles.activeCategoryButton,
              ]}
              onPress={() => navigation.navigate(category.route)} // Navigate to the respective screen
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

        {/* Content Section */}
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
    </View>
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
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,  // Keep it at the bottom
  },
});

export default MainPage;
