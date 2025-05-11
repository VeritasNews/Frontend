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
import { getArticlesForUser, logInteraction } from "../../utils/articleAPI";
import Header from "../../components/Header";
import CategoryBar from "../../components/CategoryBar";
import BottomNav from "../../components/BottomNav";
import { getUserProfile } from "../../utils/authAPI";
import { getFullImageUrl } from "../../utils/articleAPI";

const isPortrait = () => {
  const { width, height } = Dimensions.get("window");
  return height >= width;
};

const ScrollableScreen = ({ navigation }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portrait, setPortrait] = useState(isPortrait());
  const [preferredCategories, setPreferredCategories] = useState([]);
  const windowWidth = Dimensions.get("window").width;
  const isWideWeb = windowWidth >= 750;

  useEffect(() => {
    fetchNews();
    const updateOrientation = () => setPortrait(isPortrait());
    const subscription = Dimensions.addEventListener("change", updateOrientation);
    return () => subscription?.remove();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const [articles, user] = await Promise.all([
        getArticlesForUser(),
        getUserProfile(),
      ]);

      const userPrefs = user?.preferredCategories || [];
      const most = articles.find(a => (a.priority?.toLowerCase() === "most" || a.personalized_priority?.toLowerCase() === "most"));
      const rest = articles.filter(a => a !== most);
      const sorted = sortNewsByPreferenceAndPriority(rest, userPrefs);
      const sized = assignNewsSizes(sorted);

      const finalList = most ? [ { ...most, size: "xl" }, ...sized ] : sized;
      setNewsData(finalList);
      setPreferredCategories(userPrefs);
    } catch (err) {
      console.error("Error loading personalized feed:", err);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  const sortNewsByPreferenceAndPriority = (articles, preferredCategories = []) => {
    const priorityGroups = { high: [], medium: [], low: [], other: [] };

    articles.forEach((article) => {
      const priority = article.personalized_priority?.toLowerCase();
      if (priority === "high") priorityGroups.high.push(article);
      else if (priority === "medium") priorityGroups.medium.push(article);
      else if (priority === "low") priorityGroups.low.push(article);
      else priorityGroups.other.push(article);
    });

    const sortGroupBySummaryLength = (group) =>
      group.sort((a, b) => (a.summary?.length || 0) - (b.summary?.length || 0));

    const preferredFirst = (group) => {
      return [...group].sort((a, b) => {
        const aPref = preferredCategories.includes(a.category);
        const bPref = preferredCategories.includes(b.category);
        return aPref === bPref ? 0 : aPref ? -1 : 1;
      });
    };

    return [
      ...preferredFirst(sortGroupBySummaryLength(priorityGroups.high)),
      ...preferredFirst(sortGroupBySummaryLength(priorityGroups.medium)),
      ...preferredFirst(sortGroupBySummaryLength(priorityGroups.low)),
      ...preferredFirst(sortGroupBySummaryLength(priorityGroups.other)),
    ];
  };

  const assignNewsSizes = (data) => {
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

  const renderHeroArticle = (article) => {
    if (!article) return null;
    const imageUrl = article.image ? getFullImageUrl(article.image) : null;

    return (
      <TouchableOpacity
        onPress={async () => {
          await logInteraction(article.id, "click");
          navigation.navigate("NewsDetail", { articleId: article.id });
        }}
      >
        <View style={[styles.heroCard, isWideWeb && styles.wideWebHeroCard]}>
          <Text style={styles.heroTitle}>{article.title}</Text>
          {article.summary && (
            <Text style={styles.heroSummary}>{article.summary}</Text>
          )}
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={[styles.heroImage, isWideWeb && styles.wideWebHeroImage]}
              onError={(e) => console.error("Image load error:", e.nativeEvent.error)}
            />
          )}
        </View>
      </TouchableOpacity>
    );
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

  const renderNewsCard = (item) => {
    const fontSize = getFontSize(item.size);
    const imageUrl = item.image ? getFullImageUrl(item.image) : null;

    return (
      <TouchableOpacity
        onPress={async () => {
          await logInteraction(item.id, "click");
          navigation.navigate("NewsDetail", { articleId: item.id });
        }}
      >
        <View style={[styles.newsCard, isWideWeb && styles.wideWebNewsCard]}>
          <Text style={[styles.newsTitle, { fontSize: fontSize.title }]}>{item.title}</Text>
          <View style={styles.horizontalLine} />
          {item.summary && (
            <Text style={[styles.summaryText, { fontSize: fontSize.summary }]}>{item.summary}</Text>
          )}
          {imageUrl && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.imagePlaceholder}
              onError={(e) => console.error("Image load error:", e.nativeEvent.error)}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const mostPriorityArticle = newsData.find(
    a => a.priority?.toLowerCase() === "most" || a.personalized_priority?.toLowerCase() === "most"
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading articles...</Text>
      </View>
    );
  }

  const containerStyle = Platform.select({
    web: {
      backgroundColor: "white",
      display: "flex",
      height: "100vh",
      width: "100vw",
      position: "relative",
    },
    default: {
      flex: 1,
      backgroundColor: "white",
      position: "relative",
    },
  });

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
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator
      >
        <Header />
        <View style={styles.categoryContainer}>
          <CategoryBar navigation={navigation} />
        </View>

        <View style={styles.singleColumnContainer}>
          {mostPriorityArticle && (
            <View style={styles.singleArticleContainer}>
              {renderHeroArticle(mostPriorityArticle)}
            </View>
          )}

          {newsData
            .filter(a => a !== mostPriorityArticle)
            .map((article) => (
              <View key={article.id} style={styles.singleArticleContainer}>
                {renderNewsCard(article)}
              </View>
            ))}
        </View>

        {newsData.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>No articles found</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.navContainer}>
        <BottomNav navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    alignItems: "center",
    marginVertical: 1,
  },
  singleColumnContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  singleArticleContainer: {
    marginBottom: 5,
    width: "100%",
    maxWidth: 450,
    alignSelf: "center",
  },
  heroCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    alignItems: "center",
    marginBottom: 10,
    width: "95%",
    alignSelf: "center",
  },
  wideWebHeroCard: {
    width: 700,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    margin: 8,
  },
  wideWebNewsCard: {
    width: 700,
    alignSelf: "center",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    margin: 8,
  },
  heroImage: {
    width: "100%",
    height: 240,
    marginTop: 8,
    resizeMode: "cover",
  },
  wideWebHeroImage: {
    width: "100%",
    height: 300,
    marginTop: 8,
    resizeMode: "cover",
  },
  newsCard: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
    margin: 3,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "700",
    fontFamily: `"Inter Variable", -apple-system, "Segoe UI Variable Text", "SF Pro Text", sans-serif`,
    color: "#333",
    marginBottom: 3,
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: -0.3,
  },
  heroSummary: {
    fontFamily: `"Inter Variable", -apple-system, "Segoe UI Variable Text", "SF Pro Text", sans-serif`,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  newsTitle: {
    fontWeight: "600",
    fontFamily: `"Inter Variable", -apple-system, "Segoe UI Variable Text", "SF Pro Text", sans-serif`,
    color: "#333",
    letterSpacing: -0.2,
    textAlign: "center",
  },
  summaryText: {
    fontFamily: `"Inter Variable", -apple-system, "Segoe UI Variable Text", "SF Pro Text", sans-serif`,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 22,
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#ddd",
    marginTop: 10,
    resizeMode: "cover",
  },
  horizontalLine: {
    height: 0.5,
    backgroundColor: "#000",
    width: "100%",
    marginVertical: 6,
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
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
});

export default ScrollableScreen;
