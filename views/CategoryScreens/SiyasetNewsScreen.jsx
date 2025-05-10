import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform
} from "react-native";
import { getArticlesByCategory, logInteraction, getFullImageUrl } from "../../utils/articleAPI";
// Make sure we're using the proper image URL function
console.log("Image URL function available:", typeof getFullImageUrl === 'function');
import Header from "../../components/Header";
import CategoryBar from "../../components/CategoryBar";
import BottomNav from "../../components/BottomNav";
import SearchBarWithResults from '../../components/SearchBarWithResults';
import { getUserProfile } from "../../utils/authAPI";

const isPortrait = () => {
  const { width, height } = Dimensions.get("window");
  return height >= width;
};

const chunkArray = (array, chunkSize = 4) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const SiyasetNewsScreen = ({ navigation }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portrait, setPortrait] = useState(isPortrait());
  const { width: deviceWidth } = Dimensions.get("window");
  const isWeb = Platform.OS === "web";
  const windowWidth = Dimensions.get("window").width;
  const isWideWeb = windowWidth >= 750;
  
  // Set the category specifically to "siyaset"
  const category = "siyaset";

  useEffect(() => {
    fetchNews();
    const updateOrientation = () => setPortrait(isPortrait());
    const subscription = Dimensions.addEventListener("change", updateOrientation);
    return () => subscription?.remove();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const news = await getArticlesByCategory(category);
      console.log(`✅ Loaded ${news.length} articles for ${category}`);

      // Verify article structure - check first article for debugging
      if (news.length > 0) {
        console.log("First article structure:", JSON.stringify({
          id: news[0].id,
          title: news[0].title,
          hasImage: !!news[0].image,
          imageUrl: news[0].image ? getFullImageUrl(news[0].image) : 'none'
        }));
      }
      
      setNewsData(news);
    } catch (err) {
      console.error(`Error loading ${category} feed:`, err);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  const assignNewsSizes = (data) => {
    if (!data || data.length === 0) return [];

    const total = data.length;
    const xl = Math.ceil(total * 0.1);
    const lg = Math.ceil(total * 0.15);
    const md = Math.ceil(total * 0.25);
    const sm = Math.ceil(total * 0.3);

    return data.map((a, i) => {
      if (i < xl) return { ...a, size: "xl" };
      if (i < xl + lg) return { ...a, size: "large" };
      if (i < xl + lg + md) return { ...a, size: "medium" };
      if (i < xl + lg + md + sm) return { ...a, size: "small" };
      return { ...a, size: "xs" };
    });
  };

  const sortedNews = assignNewsSizes(newsData);
  const heroArticle = sortedNews.length > 0 ? sortedNews[0] : null;
  const columnData = sortedNews.length > 0 ? sortedNews.slice(1) : [];
  const columnCount = isWideWeb ? 3 : portrait ? 2 : 1;

  const createDynamicColumns = (data, columnCount) => {
    const maxColumns = isWideWeb ? 3 : portrait ? 2 : 1;
    const columns = Array.from({ length: maxColumns }, () => []);
    data.forEach((item, index) => {
      const columnIndex = index % maxColumns;
      if (columns[columnIndex].length < 3) {
        columns[columnIndex].push(item);
      } else {
        columns[(columnIndex + 1) % maxColumns].push(item);
      }
    });
    return columns;
  };

  const getFontSize = (size) => {
    switch (size) {
      case "xl": return { title: 20, summary: 13 };
      case "large": return { title: 19, summary: 12.7 };
      case "medium": return { title: 18, summary: 12.3 };
      case "small": return { title: 16, summary: 12 };
      case "xs":
      default: return { title: 14, summary: 10 };
    }
  };

  const renderHeroArticle = (article) => {
    if (!article) return null;

    // Process image URL with proper error handling
    const imageUrl = article.image ? getFullImageUrl(article.image) : null;
    console.log("📸 Hero image URL:", imageUrl);

    return (
      <TouchableOpacity
        onPress={async () => {
          await logInteraction(article.id, "click");
          navigation.navigate("NewsDetail", { articleId: article.id });
        }}
      >
        <View style={[styles.heroCard, isWideWeb && styles.wideWebHeroCard]}>
          {typeof article.title === "string" && (
            <Text style={styles.heroTitle}>{article.title}</Text>
          )}
          {typeof article.summary === "string" && (
            <Text style={styles.heroSummary}>{article.summary}</Text>
          )}
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={[styles.heroImage, isWideWeb && styles.wideWebHeroCardImage]}
              resizeMode="cover"
              onError={(e) => console.error("Image load error:", e.nativeEvent.error)}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderNewsCard = (item, showImage = true, imageHeight = 100) => {
    const fontSize = getFontSize(item.size);
    // Check if image exists and process it correctly
    const imageUrl = item.image ? getFullImageUrl(item.image) : null;
    console.log("📸 Image URL for article:", item.id, imageUrl);

    return (
      <TouchableOpacity
        onPress={async () => {
          await logInteraction(item.id, "click");
          navigation.navigate("NewsDetail", { articleId: item.id });
        }}
      >
        <View
          style={[
            styles.newsCard,
            isWideWeb && styles.wideWebNewsCard,
          ]}
        >
          <Text style={[styles.newsTitle, { fontSize: fontSize.title }]}>{item.title}</Text>
          <View style={styles.horizontalLine} />
          {item.summary && (
            <Text style={[styles.summaryText, { fontSize: fontSize.summary }]}>{item.summary}</Text>
          )}
          {showImage && imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={[styles.imagePlaceholder, { height: imageHeight }, isWideWeb && styles.wideWebNewsCardImage]}
              resizeMode="cover"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const containerStyle = Platform.select({
    web: {
      backgroundColor: "white",
      display: "flex",
      height: "100vh",
      width: "100vw",
    },
    default: {
      flex: 1,
      backgroundColor: "white",
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading {category} articles...</Text>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "white",
          alignItems: isWideWeb ? "center" : undefined,
          paddingHorizontal: 4,
          paddingTop: 10,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator
      >
        <SearchBarWithResults />

        <Header />
        <View style={styles.categoryContainer}>
          <CategoryBar navigation={navigation} />
        </View>

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

        {columnData.length === 0 && !heroArticle && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No articles found for {category}</Text>
          </View>
        )}
      </ScrollView>
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "white",
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
    backgroundColor: "white",
  },
  section: {
    marginBottom: 10,
    backgroundColor: "white",
  },
  siyasetHeader: {
    alignItems: "center",
    marginVertical: 10,
    paddingVertical: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  siyasetHeaderText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#a91101",
    letterSpacing: 0.5,
  },
  column: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    backgroundColor: "white",
  },
  newsItem: {
    marginBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: "white",
  },
  webWrapper: {
    width: "100%",
    maxWidth: 1200,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  rowContainer: Platform.select({
    isWideWeb: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 16,
      width: "100%",
      backgroundColor: "white",
    },
    default: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      flexWrap: "wrap",
    },
  }),
  newsCard: {
    flexGrow: 1,
    flexBasis: "49%", // Adjusts based on container width
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    margin: 3,
  },
  wideWebNewsCard: {
    width: 450,
    backgroundColor: "white",
    alignSelf: "center",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    margin: 8,
  },
  wideWebHeroCard: {
    width: 1250,
    height: 450,
    backgroundColor: "white",
    alignSelf: "center",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    margin: 8,
  },
  heroCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    alignItems: "center",
    marginBottom: 3,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "700",
    fontFamily: `"Inter Variable", -apple-system, "Segoe UI Variable Text", 
             "SF Pro Text", sans-serif`,
    color: "#333",
    marginBottom: 3,
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  heroSummary: {
    fontFamily: `"Inter Variable", -apple-system, "Segoe UI Variable Text", 
    "SF Pro Text", sans-serif`,
    textAlign: "justify",
    marginTop: 4,
    lineHeight: 24,
    letterSpacing: 0.3,
    textAlign: "center",
  },
  newsTitle: {
    fontWeight: "600",
    fontFamily: `"Inter Variable", -apple-system, "Segoe UI Variable Text", 
    "SF Pro Text", sans-serif`,
    color: "#333",
    letterSpacing: -0.2,
    textAlign: "center",
  },
  summaryText: {
    fontFamily: `"Inter Variable", -apple-system, "Segoe UI Variable Text", 
    "SF Pro Text", sans-serif`,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 22,
  },
  heroImage: {
    width: "100%",
    height: 240,
    marginTop: 8,
    resizeMode: "cover",
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
  wideWebNewsCardImage: {
    width: "100%",
    height: 240,
    marginTop: 8,
    resizeMode: "cover",
  },
  wideWebHeroCardImage: {
    width: "100%",
    height: 350,
    marginTop: 8,
    resizeMode: "cover",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  }
});

export default SiyasetNewsScreen;