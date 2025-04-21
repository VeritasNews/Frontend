import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { getArticles } from "../utils/articleAPI";
import Header from "../components/Header";
import CategoryBar from "../components/CategoryBar";
import BottomNav from "../components/BottomNav";

// Helper to detect portrait mode
const isPortrait = () => {
  const dim = Dimensions.get("screen");
  return dim.height >= dim.width;
};
const ScrollableScreen = ({ navigation }) => {
  const [newsData, setNewsData] = useState([]); // ✅ Fetched news
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [portrait, setPortrait] = useState(isPortrait());

  useEffect(() => {
    fetchNews();

    const updateOrientation = () => setPortrait(isPortrait());
    const subscription = Dimensions.addEventListener("change", updateOrientation);
    return () => subscription?.remove();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const articles = await getArticles();
      setNewsData(articles);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    }
    setLoading(false);
  };

  const renderArticle = (article, index) => (
    <View key={index} style={styles.article}>
      <Text style={styles.articleTitle}>{article.title}</Text>
      <View style={styles.contentContainer}>
        {article.image && (
          <Image
            source={{ uri: article.image }}
            style={styles.articleImage}
          />
        )}
        <View style={styles.horizontalLine} />
        <Text style={styles.articleText}>{article.summary}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <CategoryBar navigation={navigation} />

      {loading ? (
        <ActivityIndicator size="large" color="#888" style={{ marginTop: 30 }} />
      ) : Platform.OS === "web" ? (
        <View style={styles.centeredContainer}>
          <View style={styles.centerContainer}>
            {newsData.map(renderArticle)}
          </View>
        </View>
      ) : (
        <View style={styles.nonCenteredContainer}>
          {newsData.map(renderArticle)}
        </View>
      )}

      <BottomNav navigation={navigation} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 4,
    paddingTop: 10,
  },
  headerLine: {
    height: 1,
    backgroundColor: "#141413",
    width: "100%",
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
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 0,
    textAlign: "center",
    fontFamily: "OldStandard-Bold",
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
    marginVertical: 5,
  },
});

export default ScrollableScreen;
