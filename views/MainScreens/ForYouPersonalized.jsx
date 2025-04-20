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
import { getUserProfile } from "../../utils/authAPI"; // ✅ ADD THIS LINE

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
  const sectionGroups = chunkArray(articleChunks, 3); // each group = column, row, column
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
          <Text style={styles.heroTitle}>{article.title}</Text>
          {article.summary && (
            <Text style={styles.heroSummary}>{article.summary}</Text>
          )}
          {article.image && (
            <Image
            source={article.image ? { uri: article.image } : require("../../assets/protest.jpg")}
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
          {item.image && <View style={styles.imagePlaceholder}><Text>Image</Text></View>}
        </View>
      </TouchableOpacity>
    );
  };

  const createDynamicColumns = (data, columnCount) => {
    const maxColumns = Math.min(columnCount, 3);
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
    // Use a consistent key based on the row content
    return (
      <View key={row.map(item => item.id).join('-')} style={styles.row}>
        {row.map((newsItem, index) => (
          <View
            key={newsItem.id}
            style={[
              styles.newsItem,
              { width: `${index === numItems - 1 ? lastItemWidth : itemWidth}%` },
            ]}
          >
            {renderNewsCard(newsItem)}
          </View>
        ))}
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

        {renderHeroArticle(mostImportant)}

        {sectionGroups.map((group, groupIndex) => (
          <View key={groupIndex}>
            {/* Column layout */}
            {group[0] && (
              <View style={styles.section}>
                <View style={styles.rowContainer}>
                  {createDynamicColumns(group[0], columnCount).map((column, columnIndex) => (
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
            )}

            {/* Row layout */}
            {group[1] && (
              <View style={styles.section}>
                {createDynamicRows(group[1]).map((row) => renderNewsRow(row))}
              </View>
            )}

            {/* Column layout again */}
            {group[2] && (
              <View style={styles.section}>
                <View style={styles.rowContainer}>
                  {createDynamicColumns(group[2], columnCount).map((column, columnIndex) => (
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
            )}
          </View>
        ))}

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


// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    alignItems: "center",
    marginVertical: 1,  // Adds spacing above and below
  },  
  section: {
    marginBottom: 0,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  column: {
    flex: 1,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
  },
  newsItem: {
    marginBottom: 3,
    paddingHorizontal: 1,
  },
  newsCard: {
    backgroundColor: "transparent", // ← removes grey/white background
    padding: 10,
    borderRadius: 0,                // ← optional: makes it flat
    elevation: 0,                   // ← removes Android shadow
    fontFamily: "OldStandard-Bold",
    alignItems: "center",
  },
  horizontalLine: {
    height: 0.5,
    backgroundColor: "#ccc",
    width: "100%",  // ✅ Matches the width of the news card
    marginVertical: 8,
  },  
  imagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 8,
  },
  newsTitle: {
    fontFamily: "Georgia", // or "Playfair Display"
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 3,
    textAlign: "center",
  },
  summaryText: {
    fontFamily: "Merriweather", // or "Libre Baskerville"
    fontSize: 12,
    color: "#444",
    lineHeight: 18,
    marginTop: 4,
  },
  heroCard: {
    width: "100%",
    backgroundColor: "transparent", // no background, clean like newspaper
    paddingVertical: 12,
    paddingHorizontal: 0,
    marginBottom: 24,
    borderRadius: 0,
    shadowColor: "transparent", // removes any drop shadow
    elevation: 0,
    alignItems: "flex-start", // aligns content to the left like newsprint
  },  
  heroImage: {
    width: "100%",
    height: 260,
    borderRadius: 0, // no rounding for a sharp, print look
    marginBottom: 12,
    resizeMode: "cover",
  },  
  heroTitle: {
    fontSize: 30, // Make it visually loud like a newspaper headline
    fontWeight: "900", // Maximum system boldness
    fontFamily: "Georgia", // Elegant serif like newspapers
    color: "#000", // Deep black for print-style contrast
    marginBottom: 12,
    textAlign: "center", // 'middle' is not valid — use 'center'
    lineHeight: 36,
  },  
  heroSummary: {
    fontSize: 15,
    fontFamily: "Georgia",
    color: "#222",
    textAlign: "justify",
    lineHeight: 22,
  },    
});

export default ForYouPersonalized;
