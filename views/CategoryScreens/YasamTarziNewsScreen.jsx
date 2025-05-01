import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { getArticlesByCategory, logInteraction, getFullImageUrl } from "../../utils/articleAPI";
import Header from "../../components/Header";
import CategoryBar from "../../components/CategoryBar";
import BottomNav from "../../components/BottomNav";

const isPortrait = () => {
  const { width, height } = Dimensions.get("window");
  return height >= width;
};

const YasamTarziNewsScreen = ({ navigation }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portrait, setPortrait] = useState(isPortrait());
  const { width: deviceWidth } = Dimensions.get("window");

  useEffect(() => {
    fetchNews();
    const updateOrientation = () => setPortrait(isPortrait());
    const sub = Dimensions.addEventListener("change", updateOrientation);
    return () => sub?.remove();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const YasamTarziNews = await getArticlesByCategory("Yaşam Tarzı");
    setNewsData(YasamTarziNews);
    setLoading(false);
    console.log("First 3 articles:", YasamTarziNews.slice(0, 3).map(a => ({
        id: a.id,
        title: a.title,
        hasImage: !!a.image,
        imageUrl: a.image
      })));
  };

  const assignNewsSizes = (data) => {
    const total = data.length;
    const xl = 1; // Only one hero
    const rest = data.slice(1);

    return [
      { ...data[0], size: "xl" },
      ...rest.map((a, i) => ({
        ...a,
        size: i < 5 ? "medium" : "small",
      })),
    ];
  };

  const sortedNews = assignNewsSizes(newsData);

  const heroArticle = sortedNews[0];
  const columnData = sortedNews.slice(1);

  const columnCount = portrait ? 2 : 3;

  const createDynamicColumns = (data, columnCount) => {
    const columns = Array.from({ length: columnCount }, () => []);
    data.forEach((item, index) => {
      columns[index % columnCount].push(item);
    });
    return columns;
  };

  const getFontSize = (size) => {
    switch (size) {
      case "xl": return { title: 24, summary: 14 };
      case "large": return { title: 20, summary: 13 };
      case "medium": return { title: 18, summary: 12 };
      case "small": return { title: 16, summary: 11 };
      default: return { title: 14, summary: 10 };
    }
  };

  const renderHeroArticle = (article) => {
    if (!article) return null;
    const font = getFontSize("xl");
    return (
      <TouchableOpacity onPress={() => navigation.navigate("NewsDetail", { articleId: article.id })}>
        <View style={styles.heroCard}>
          <Text style={[styles.heroTitle, { fontSize: font.title }]}>{article.title}</Text>
          {article.summary && (
            <Text style={[styles.heroSummary, { fontSize: font.summary }]}>
              {article.summary}
            </Text>
          )}
          {article.image && (
            <Image
              source={{ uri: getFullImageUrl(article.image) }}
              style={styles.heroImage}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderNewsCard = (item) => {
    const font = getFontSize(item.size);
    // Log the full URL for debugging
    const imageUrl = getFullImageUrl(item.image);
    console.log(`Article ${item.id} image URL: ${imageUrl}`);
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate("NewsDetail", { articleId: item.id })}>
        <View style={[
          styles.newsCard,
          { width: deviceWidth * 0.49 }
        ]}>

          <Text style={[styles.newsTitle, { fontSize: font.title }]}>{item.title}</Text>
          <View style={styles.horizontalLine} />
          {item.summary && (
            <Text style={[styles.summaryText, { fontSize: font.summary }]}>
              {item.summary}
            </Text>
          )}
          {item.image && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.imagePlaceholder}
              onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading...</Text>
      </View>
    );
  }

    const containerStyle = Platform.select({
      web: {
        backgroundColor: "#f4f4f4",
        display: "flex",
        height: "100vh",
        width: "100vw",
      },
      default: {
        flex: 1,
        backgroundColor: "#f4f4f4",
      },
    });
    

  return (
    <View style={containerStyle}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1, // ✅ crucial to allow scrolling when content exceeds viewport
          backgroundColor: "#f4f4f4",
          paddingHorizontal: 4,
          paddingTop: 10,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator
      >
        <Header />
        <View style={styles.categoryContainer}>
          <CategoryBar navigation={navigation} />
        </View>
  
        {/* ✅ HERO CARD */}
        {renderHeroArticle(heroArticle)}
  
        <View style={styles.section}>
          <View style={styles.rowContainer}>
            {createDynamicColumns(columnData, columnCount).map((column, columnIndex) => (
              <View key={columnIndex} style={styles.column}>
                {column.map((item) => (
                  <View key={item.id} style={styles.newsItem}>
                    {renderNewsCard(item)}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
  

      </ScrollView>
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 4,
    paddingTop: 10,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "#a91101",
  },
  categoryContainer: {
    alignItems: "center",
    marginVertical: 1,
  },
  section: {
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
  },
  column: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  newsItem: {
    marginBottom: 5,
    paddingHorizontal: 3,
  },
  newsCard: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    width: "100%",
    borderColor: "#bbb",
    alignItems: "center",
  },
  heroCard: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    alignItems: "center",
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 30, // Make it visually loud like a newspaper headline
    fontWeight: "900", // Maximum system boldness
    fontFamily: "Georgia", // Elegant serif like newspapers
    color: "#000", // Deep black for print-style contrast
    marginBottom: 4,
    textAlign: "center", // 'middle' is not valid — use 'center'
    lineHeight: 36,
  },
  heroSummary: {
    fontFamily: "Georgia",
    color: "#333",
    textAlign: "justify",
    marginTop: 0,
    lineHeight: 20,
    textAlign: "center", // 'middle' is not valid — use 'center'
  },
  heroImage: {
    width: "100%",
    height: 240,
    marginTop: 8,
    resizeMode: "cover",
  },
  newsTitle: {
    fontWeight: "bold",
    fontFamily: "Georgia",
    textAlign: "center",
  },
  summaryText: {
    fontFamily: "Merriweather",
    color: "#444",
    textAlign: "center",
    marginTop: 4,
  },
  imagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#ddd",
    marginTop: 10,
  },
  horizontalLine: {
    height: 0.5,
    backgroundColor: "#000",
    width: "100%",
    marginVertical: 6,
  },
});

export default YasamTarziNewsScreen;
