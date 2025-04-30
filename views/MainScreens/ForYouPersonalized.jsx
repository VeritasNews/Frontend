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
import { getUserProfile } from "../../utils/authAPI"; // ✅ ADD THIS LINE
import { getFullImageUrl } from "../../utils/articleAPI";

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

const ForYouPersonalized = ({ navigation }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portrait, setPortrait] = useState(isPortrait());
  const [preferredCategories, setPreferredCategories] = useState([]);
  const { width: deviceWidth } = Dimensions.get("window");

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
  
  function shouldShowImage(article, rowLength, indexInRow) {
    const priority = article.personalized_priority?.toLowerCase() || article.priority?.toLowerCase() || "";
  
    const isHighPriority = ["most", "high"].includes(priority);
    const shortSummary = (article.summary?.length || 0) < 100;
    const shortTitle = (article.title?.length || 0) < 50;
  
    if (rowLength < 3) return true; // Always show in 1-2 layouts
    if (isHighPriority && shortSummary) return true; // priority + visual space
    if (shortTitle && indexInRow === 1) return true; // middle one only
  
    return false;
  }
  
  
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

  const mostImportant = newsData.length > 0 && 
  newsData.find(a => a.priority === "most" || a.personalized_priority === "most");

  // Filter out the most important article from the data that will be used in the grid
  const otherArticles = mostImportant ? 
    newsData.filter(article => article.id !== mostImportant.id) : 
    newsData;

  // Sort and size the filtered list
  const sortedNewsData = assignNewsSizes(
    sortNewsByPreferenceAndPriority(otherArticles, preferredCategories)
  );
  const articleChunks = chunkArray(sortedNewsData, 4);
  const sectionGroups = chunkArray(articleChunks, 1); // each group = column, row, column
  // Find the most important article


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
          {typeof article.title === "string" && (
            <Text style={styles.heroTitle}>{article.title}</Text>
          )}
          {typeof article.summary === "string" && (
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

  const renderNewsCard = (item, showImage = true, imageHeight = 100) => {
    const fontSize = getFontSize(item.size);
    return (
      <TouchableOpacity
        onPress={async () => {
          await logInteraction(item.id, "click");
          navigation.navigate("NewsDetail", { articleId: item.id });
        }}
      >
        <View style={[
          styles.newsCard,
          {
            width: deviceWidth * 0.49, // About 46% of screen width
          },
        ]}>

          <Text style={[styles.newsTitle, { fontSize: fontSize.title }]}>{item.title}</Text>
          <View style={styles.horizontalLine} />
          {item.summary && (
            <Text style={[styles.summaryText, { fontSize: fontSize.summary }]}>{item.summary}</Text>
          )}
          {showImage && item.image && (
            <Image
              source={{ uri: getFullImageUrl(item.image) }}
              style={[styles.imagePlaceholder, { height: imageHeight }]}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  

  const createDynamicColumns = (data, columnCount) => {
    const maxColumns = Math.min(columnCount, 2);
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

  const createDynamicRows = (data, maxItemsPerRow = 3) => {
    const rows = [];
    let currentRow = [];
    data.forEach((item) => {
      currentRow.push(item);
      if (currentRow.length === maxItemsPerRow) {
        rows.push(currentRow);
        currentRow = [];
      }
    });
    if (currentRow.length > 0) rows.push(currentRow);
    return rows;
  };

  const renderNewsRow = (row) => {
    const numItems = row.length;
    const itemWidth = 100 / numItems;
    const lastItemWidth = 100 - itemWidth * (numItems - 1);
  
    // Base height for all
    const baseImageHeight = numItems === 3 ? 60 : 100;
    const bonusHeight = 40;
  
    // Find index of the shortest summary
    let shortestSummaryIndex = 0;
    let shortestLength = Infinity;
  
    row.forEach((item, idx) => {
      const length = item.summary?.length || 0;
      if (length < shortestLength) {
        shortestLength = length;
        shortestSummaryIndex = idx;
      }
    });
  
    return (
      <View key={row.map(item => item.id).join('-')} style={styles.row}>
        {row.map((newsItem, index) => {
          const isShortest = index === shortestSummaryIndex;
          const imageHeight = isShortest ? baseImageHeight + bonusHeight : baseImageHeight;
  
          return (
            <View
              key={newsItem.id}
              style={[
                styles.newsItem,
                { width: `${index === numItems - 1 ? lastItemWidth : itemWidth}%` },
              ]}
            >
              {renderNewsCard(newsItem, true, imageHeight)}
            </View>
          );
        })}
      </View>
    );
  };
  
  
  const columnCount = portrait ? 2 : 3;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading articles...</Text>
      </View>
    );
  }
  console.log("🧠 Current platform:", Platform.OS);

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
  
        {renderHeroArticle(mostImportant)}
  
        <View style={styles.section}>
          <View style={styles.rowContainer}>
            {createDynamicColumns(sortedNewsData, columnCount).map((column, columnIndex) => (
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
  
        {sortedNewsData.length === 0 && (
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

export default ForYouPersonalized;
