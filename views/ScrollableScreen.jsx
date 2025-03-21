import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";

const articles = [
  {
    title: "Bahçeli, Öcalan'ı Mecliste Konuşmaya Çağırıyor: Silah Bırakımını İlan Etmeli",
    content: "Bahçeli, Öcalan'ı Meclis'te DEM grubunda silahları bırakıp terörün sonunu ilan etmeye çağırdı.  \"Umut Hakkı\"ndan yararlanma teklifini de gündeme getirdi.",
    image: require("../assets/bahceli.jpg"),
    date: "20 Aralık 2024",
  },
  {
    title: "Erdoğan, Sudan Egemenlik Konseyi Başkanı ile Görüştü",
    content: "Cumhurbaşkanı Erdoğan, Sudan Egemenlik Konseyi Başkanı Burhan ile görüştü.  Görüşmede Türkiye-Sudan ilişkileri, bölgesel konular ve Türkiye'nin Somali-Etiyopya anlaşmazlığındaki rolü ele alındı. Erdoğan, Sudan-BAE ihtilafında da arabuluculuk teklif etti.",
    date: "18 Aralık 2024",
  },
  {
    title: "2026 Dünya Kupası Avrupa Elemeleri'nde Türkiye'nin Rakipleri Belli Oldu",
    content: "2026 Dünya Kupası Avrupa Elemeleri'nde A Milli Takım, E Grubu'nda İspanya-Hollanda maçının galibi, Gürcistan ve Bulgaristan ile mücadele edecek.  Grup maçları Eylül 2025'te başlayacak.",
    image: require("../assets/image2.jpg"),
    date: "19 Aralık 2024",
  },
  {
    title: "Türkiye-ABD Dışişleri Bakanları Görüşmesi",
    content: "Türkiye Dışişleri Bakanı Hakan Fidan ve ABD Dışişleri Bakanı Antony Blinken, 19 Aralık 2024 tarihinde Ankara'da bir araya geldi. Görüşmede Suriye ve Gazze'deki durum ele alındı.",
    image: require("../assets/image1.jpg"),
    date: "17 Aralık 2024",
  },
  {
    title: "Grevin Ekonomik Etkisi",
    content: "Grevin yerel ekonomiye etkisi başlıyor, işletmeler taşıma durmalarından dolayı zarar bildirmeye başladı.",
    image: require("../assets/image3.jpg"),
    date: "16 Aralık 2024",
  },
  {
    title: "Müzakereler İçin Çağrılar",
    content: "Her iki taraf da müzakerelere ihtiyaç duyulduğunda hemfikir ve gelecek hafta çözüm için görüşmelerin başlaması planlanıyor.",
    date: "15 Aralık 2024",
  },
  {
    title: "Bahçeli, Öcalan'ı Meclis'te Konuşmaya Çağırıyor: Silah Bırakımını İlan Etsin",
    content: "MHP lideri Bahçeli, Öcalan'ın Meclis'te DEM partisine gelerek terörün sonlandığını ilan etmesini istedi. Bu adımın \"umut hakkı\" yasasıyla Öcalan'ın serbest kalmasının önünü açabileceğini belirtti. Bahçeli, terörle mücadelede ortak aklı ve milli birliği savundu.",
    image: require("../assets/bahceli.jpg"),
    date: "14 Aralık 2024",
  },
];


const categories = [
    { label: "For You Page", route: "ForYou", isActive: false },
    { label: "Friends", route: "Friends", isActive: false },
    { label: "Tech", route: "Tech", isActive: false },
    { label: "Arts", route: "Arts", isActive: false },
    { label: "Scrollable", route: "Scrollable", isActive: true },
];

const ScrollableScreen = ({ navigation }) => {
  const renderArticle = (article, index) => {
    return (
      <View key={index} style={styles.article}>
        <Text style={[styles.articleTitle, article.title === "Growing Support for Strikers" && styles.largeTitle]}>
          {article.title}
        </Text>
        <View style={styles.contentContainer}>
          {article.image && <Image source={article.image} style={styles.articleImage} />}
          <View style={styles.horizontalLine} />
          <Text style={styles.articleText}>{article.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Logo and Date */}
      <View style={styles.headerLine} />
      <View style={styles.header}>
        <Image source={require('../assets/set2_no_bg.png')} style={styles.logo} />
        <Text style={styles.title}>Veritas</Text>
        <Text style={styles.date}>December 20, 2024</Text>
      </View>
      <View style={styles.headerLine} />

      {/* Categories Bar */}
      <View style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryButton, category.isActive && styles.activeCategoryButton]}
            onPress={() => {
              // Navigate to the category's route
              navigation.navigate(category.route);
            }}
          >
            <Text
              style={[styles.categoryButtonText, category.isActive && styles.activeCategoryButtonText]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditionally Render Centered Container for Web */}
      {Platform.OS === "web" ? (
        <View style={styles.centeredContainer}>
          <View style={styles.centerContainer}>
            {articles.map((article, index) => renderArticle(article, index))}
          </View>
        </View>
      ) : (
        <View style={styles.nonCenteredContainer}>
          {articles.map((article, index) => renderArticle(article, index))}
        </View>
      )}

      {/* Navigation Bar */}
      <View style={styles.navigationBar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.navItemText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('About')}>
          <Text style={styles.navItemText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.navItemText}>Contact</Text>
        </TouchableOpacity>
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
    backgroundColor: "#a91101",  // Active button color
  },
  categoryButtonText: {
    fontSize: 14,
    color: "#333",
  },
  activeCategoryButtonText: {
    color: "#fff",  // Text color for active category
  },
  centeredContainer: {
    flex: 1,  // Allow this container to take up remaining space
    justifyContent: "center",  // Vertically center its content
    alignItems: "center",  // Horizontally center its content
    width: "100%",  // Make sure it spans the entire width
    paddingBottom: 50, // Space for navigation bar
  },
  nonCenteredContainer: {
    width: "100%",
    paddingBottom: 50,
  },
  centerContainer: {
    flexDirection: "column",
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
  articleImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
    maxHeight: 200,
    borderRadius: 2,
    marginBottom: 8,
    resizeMode: "cover",
  },
  articleText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 18,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  navItemText: {
    fontSize: 14,
    color: "#333",
  },
});

export default ScrollableScreen;
