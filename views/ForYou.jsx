import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { getArticles } from "../utils/articleAPI";
import Header from "../components/Header";
import CategoryBar from "../components/CategoryBar";
import BottomNav from "../components/BottomNav";

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

const ForYou = ({ navigation }) => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portrait, setPortrait] = useState(isPortrait());

  useEffect(() => {
    fetchNews();
    const updateOrientation = () => setPortrait(isPortrait());
    const subscription = Dimensions.addEventListener("change", updateOrientation);
    return () => subscription?.remove();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const articles = await getArticles();
    setNewsData(articles);
    setLoading(false);
  };

  const sortNewsByPriorityAndSize = (data) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return [...data].sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      const summaryLengthA = a.summary?.length || 0;
      const summaryLengthB = b.summary?.length || 0;
      return summaryLengthA - summaryLengthB;
    });
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

  const sortedNewsData = assignNewsSizes(sortNewsByPriorityAndSize(newsData));
  const articleChunks = chunkArray(sortedNewsData, 4);
  const sectionGroups = chunkArray(articleChunks, 3); // each group = column, row, column

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
      <TouchableOpacity onPress={() => navigation.navigate("NewsDetail", { articleId: item.id })}>
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
    return (
      <View key={Math.random()} style={styles.row}>
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
    marginBottom: 5,
    paddingHorizontal: 3,
  },
  newsCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 4,
    elevation: 3,
    fontFamily: "OldStandard-Bold",
    alignItems: "center",
  },
  newsTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 3,
    textAlign: "center",
    fontFamily: "OldStandard-Bold",
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
  summaryText: {
    color: "#555",
    lineHeight: 18,
    marginTop: 4,
  },  
});

export default ForYou;
