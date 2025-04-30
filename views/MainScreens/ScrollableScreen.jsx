import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image
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
      console.log("✅ User preferred:", userPrefs);
  
      articles.forEach((a) =>
        console.log(`📰 ${a.title} — priority: ${a.personalized_priority}`)
      );
      
      setPreferredCategories(userPrefs);
  
      const most = articles.find(a => (a.priority?.toLowerCase() === "most" || a.personalized_priority?.toLowerCase() === "most"));
      console.log("👑 Most priority article:", most);
  
      const rest = articles.filter(a => a.priority?.toLowerCase() !== "most");
      const sorted = sortNewsByPreferenceAndPriority(rest, userPrefs);
      const sized = assignNewsSizes(sorted);
  
      const finalList = most ? [ { ...most, size: "xl" }, ...sized ] : sized;
      setNewsData(finalList);
  
    } catch (err) {
      console.error("Error loading personalized feed:", err);
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };
  
  const sortNewsByPreferenceAndPriority = (articles, preferredCategories = []) => {
    const priorityGroups = {
      high: [],
      medium: [],
      low: [],
      other: [],
    };
  
    articles.forEach((article) => {
      const priority = article.personalized_priority?.toLowerCase();
      if (priority === "high") {
        priorityGroups.high.push(article);
      } else if (priority === "medium") {
        priorityGroups.medium.push(article);
      } else if (priority === "low") {
        priorityGroups.low.push(article);
      } else {
        priorityGroups.other.push(article);
      }
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
    return (
      <TouchableOpacity
        onPress={async () => {
          await logInteraction(article.id, "click");
          navigation.navigate("NewsDetail", { articleId: article.id });
        }}
      >
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>{article.title}</Text>
          {article.summary && (
            <Text style={styles.heroSummary}>{article.summary}</Text>
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
    return (
      <TouchableOpacity
        onPress={async () => {
          await logInteraction(item.id, "click");
          navigation.navigate("NewsDetail", { articleId: item.id });
        }}
      >
        <View style={[styles.newsCard, styles[item.size]]}>
          <Text style={[styles.newsTitle, { fontSize: fontSize.title }]}>{item.title}</Text>
          <View style={styles.horizontalLine} />
          {item.summary && (
            <Text style={[styles.summaryText, { fontSize: fontSize.summary }]}>{item.summary}</Text>
          )}
          {item.image && (
            <Image
              source={{ uri: getFullImageUrl(item.image) }}
              style={styles.imagePlaceholder}
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
        <Text>Loading articles...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
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

        {/* Render hero article if exists */}
        {newsData.find(a => a.priority === "most" || a.personalized_priority === "most") && 
          renderHeroArticle(newsData.find(a => a.priority === "most" || a.personalized_priority === "most"))}

        {/* Render all other articles in single column */}
        <View style={styles.singleColumnContainer}>
          {newsData
            .filter(article => !(article.priority === "most" || article.personalized_priority === "most"))
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
  },
  categoryContainer: {
    alignItems: "center",
    marginVertical: 1,
  },
  singleColumnContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  singleArticleContainer: {
    marginBottom: 10,
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
    fontWeight: "bold",
    fontFamily: "Georgia",
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "bold",
  },
  heroSummary: {
    fontFamily: "Georgia",
    color: "#333",
    textAlign: "justify",
    marginTop: 10,
    lineHeight: 20,
  },
  heroImage: {
    width: "100%",
    height: 240,
    marginTop: 8,
    resizeMode: "cover",
  },
  newsCard: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bbb",
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
});

export default ScrollableScreen;