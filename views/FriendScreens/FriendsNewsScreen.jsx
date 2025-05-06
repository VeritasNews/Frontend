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
import { Ionicons } from "@expo/vector-icons"; // ✅ Add this if using Ionicons
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import CategoryBar from "../../components/CategoryBar";
import { getFriendsLikedArticles } from "../../utils/friendAPI";
import { getFullImageUrl } from "../../utils/articleAPI";
import { getFriendsWhoLikedArticle } from "../../utils/friendAPI";
import SearchBarWithResults from "../../components/SearchBarWithResults";

const isPortrait = () => {
  const { width, height } = Dimensions.get("window");
  return height >= width;
};

const FriendsNewsScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portrait, setPortrait] = useState(isPortrait());
  const [friendsMap, setFriendsMap] = useState({});

  useEffect(() => {
    fetchArticles();
    const sub = Dimensions.addEventListener("change", () =>
      setPortrait(isPortrait())
    );
    return () => sub?.remove();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await getFriendsLikedArticles();
  
      // 🔁 Fetch friend names for each article
      const friendsPromises = data.map(async (article) => {
        try {
          const res = await getFriendsWhoLikedArticle(article.id);
          return { articleId: article.id, friends: res || [] };
        } catch (err) {
          console.error("Friend fetch failed:", article.id, err);
          return { articleId: article.id, friends: [] };
        }
      });
  
      const results = await Promise.all(friendsPromises);
      const map = {};
      results.forEach(({ articleId, friends }) => {
        map[articleId] = friends;
      });
      setFriendsMap(map);
  
      // 🔝 Sort articles by number of friends who liked it
      const sorted = [...data].sort((a, b) => {
        const likesA = map[a.id]?.length || 0;
        const likesB = map[b.id]?.length || 0;
        return likesB - likesA;
      });
  
      // Assign sizes AFTER sorting
      setArticles(assignNewsSizes(sorted));
  
    } catch (err) {
      console.error("Error loading friends' liked articles", err);
    } finally {
      setLoading(false);
    }
  };
  

  const assignNewsSizes = (data) => {
    if (!data.length) return [];
    const total = data.length;
    const rest = data.slice(1);
    return [
      { ...data[0], size: "xl" },
      ...rest.map((a, i) => ({
        ...a,
        size: i < 5 ? "medium" : "small",
      })),
    ];
  };

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
      case "medium": return { title: 18, summary: 12 };
      case "small": return { title: 16, summary: 11 };
      default: return { title: 14, summary: 10 };
    }
  };

  const renderHeroArticle = (article, friendsMap) => {
    if (!article) return null;
    const font = getFontSize("xl");
    const friends = friendsMap[article.id] || [];
  
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("FriendsArticleDetail", { articleId: article.id })}
      >
        <View style={styles.heroCard}>
          <Text style={[styles.heroTitle, { fontSize: font.title }]}>{article.title}</Text>
          
          {article.summary && (
            <Text style={[styles.heroSummary, { fontSize: font.summary }]}>{article.summary}</Text>
          )}
          
          {article.image && (
            <Image
              source={{ uri: getFullImageUrl(article.image) }}
              style={styles.heroImage}
            />
          )}
  
          {friends.length > 0 && (
            <View style={styles.metaBottomRow}>
              <Ionicons name="people" size={16} color="#666" style={{ marginRight: 4 }} />
              <Text style={styles.metaRowText}>
                <Text style={styles.metaLabel}>Liked by: </Text>
                {friends.map((f, i) =>
                  `${f.name || f.username}${i < friends.length - 1 ? ', ' : ''}`
                )}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  

  const renderNewsCard = (item) => {
    const font = getFontSize(item.size);
    const friends = friendsMap[item.id] || [];
  
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("FriendsArticleDetail", { articleId: item.id })}
      >
        <View style={styles.newsCard}>
          <Text style={[styles.newsTitle, { fontSize: font.title }]}>{item.title}</Text>
          <View style={styles.horizontalLine} />
          {item.summary && (
            <Text style={[styles.summaryText, { fontSize: font.summary }]}>{item.summary}</Text>
          )}
          {item.image && (
            <Image
              source={{ uri: getFullImageUrl(item.image) }}
              style={styles.imagePlaceholder}
            />
          )}
  
          {friends.length > 0 && (
            <View style={styles.metaBottomRow}>
              <Ionicons name="people" size={16} color="#666" style={{ marginRight: 4 }} />
              <Text style={styles.metaRowText}>
                <Text style={styles.metaLabel}>Liked by: </Text>
                {friends.map((f, i) => (
                  `${f.name || f.username}${i < friends.length - 1 ? ', ' : ''}`
                ))}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a91101" />
        <Text>Loading friends’ liked articles…</Text>
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

  const heroArticle = articles[0];
  const otherArticles = articles.slice(1);
  const columnCount = portrait ? 2 : 3;

  return (
    <View style={containerStyle}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#f4f4f4",
          paddingHorizontal: 4,
          paddingTop: 10,
          paddingBottom: 100,
        }}
      >
      <SearchBarWithResults />
        <Header />
        <CategoryBar navigation={navigation} />

        {renderHeroArticle(heroArticle, friendsMap)}


        <View style={styles.section}>
          <View style={styles.rowContainer}>
            {createDynamicColumns(otherArticles, columnCount).map((column, columnIndex) => (
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
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 12,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  newsCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  heroCard: {
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bbb",
    alignItems: "center",
    marginBottom: 12,
  },
  heroTitle: {
    fontWeight: "bold",
    fontFamily: "Georgia",
    color: "#000",
    textAlign: "center",
  },
  heroSummary: {
    fontFamily: "Georgia",
    color: "#333",
    textAlign: "center",
    marginTop: 4,
  },
  heroImage: {
    width: "100%",
    height: 220,
    marginTop: 10,
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
    backgroundColor: "#aaa",
    width: "100%",
    marginVertical: 6,
  },
  metaBottomRow: {
    flexDirection: "row",
    alignItems: "left",
    marginTop: 10,
  },
  metaRowText: {
    fontSize: 12,
    color: "#666",
    flexShrink: 1,
  },
  metaLabel: {
    fontWeight: "bold",
    color: "#444",
  },
  
});

export default FriendsNewsScreen;
