import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getArticles } from "../../utils/api"; // Import the API function
import { NavigationItem } from "../../navigation/NavigationItem";
import { CategoryButton } from "../../components/CategoryButton";
import { GLOBAL_STYLES } from "../../theme/globalStyles";
import COLORS from "../../theme/colors";
import FONTS from "../../theme/fonts";
import Header from "../../components/Header";
import CategoryBar from "../../components/CategoryBar";
import BottomNav from "../../components/BottomNav";

const categories = [
  { label: "For You Page", route: "ForYou", isActive: true },
  { label: "Friends", route: "Friends", isActive: false },
  { label: "Tech", route: "Tech", isActive: false },
  { label: "Arts", route: "Arts", isActive: false },
  { label: "Scrollable", route: "Scrollable", isActive: false },
];

const MainPage = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true); // ✅ Show loading indicator while fetching
      const data = await getArticles();
  
      if (!data || !Array.isArray(data)) {
        console.error("❌ Error: Fetched data is not an array", data);
        setArticles([]); // ✅ Prevent empty UI breaking
      } else {
        setArticles(data);
      }
    } catch (error) {
      console.error("❌ Error fetching articles:", error);
      setArticles([]); // ✅ Prevent breaking the UI
    } finally {
      setLoading(false);
    }
  };
  

  const renderArticle = (article, index) => {
    const isImageOnSide = index % 4 === 0; // ✅ Position side image dynamically
  
    return (
      <View key={article.id || index} style={styles.article}>
        <Text style={[styles.articleTitle, index % 5 === 0 && styles.largeTitle]}>
          {article.title}
        </Text>
        <View style={[styles.contentContainer, isImageOnSide && styles.contentContainerRow]}>
          {article.image ? (
            <Image
              source={{ uri: article.image }} // ✅ Ensure images are loaded correctly
              style={isImageOnSide ? styles.articleImageSide : styles.articleImage}
              resizeMode="cover" // ✅ Prevents stretching issues
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          <View style={styles.horizontalLine} />
          <Text style={styles.articleText}>{article.summary || "No summary available"}</Text>
        </View>
      </View>
    );
  };
  
// ✅ Divide articles into 2 columns for even distribution
const columns = [[], []];
articles.forEach((article, index) => {
  columns[index % 2].push(renderArticle(article, index));
});

return (
  <View style={{ flex: 1 }}>
    {loading ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading articles...</Text>
      </View>
    ) : (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <Header />
        <CategoryBar categories={categories} />

       {/* Content Section */}
       <View style={styles.centerContainer}>
          {columns.map((column, columnIndex) => (
            <View key={columnIndex} style={styles.column}>
              {column}
            </View>
          ))}
        </View>

        {/* Bottom Navigation */}
        <BottomNav />
      </ScrollView>
    )}
  </View>
);
};

const styles = StyleSheet.create({
  limitedNewsContainer: {
    width: "90%",  // ✅ Limit height to 70% of viewport
    overflow: "hidden",  // ✅ Prevent content overflow
  },
  centerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "70%",  // ✅ Limit height to 70% of viewport
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  container: {
    width: "100%",  // ✅ Limit height to 70% of viewport
    paddingTop: 50,
    alignItems: "center",
    padding: 3,
    backgroundColor: "#f4f4f4",
  },
  centerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  column: {
    flex: 1,
    marginHorizontal: 1.5,
  },
  article: {
    backgroundColor: "#fff",
    borderRadius: 3,
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
  contentContainerRow: {
    flexDirection: "row", // Align content in a row when image is on the side
    flexWrap: 'wrap',  // Allow wrapping to prevent overflow
    alignItems: "flex-start",
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
  articleImageSide: {
    width: 160,
    height: 100,
    borderRadius: 4,
    marginRight: 16,
    resizeMode: "cover",
    flexShrink: 0,  // Prevent shrinking the image
  },
  articleText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 18,
    flex: 1,  // Allow text to take available space
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  }, 
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  placeholderText: {
    color: "#555",
    fontSize: 14,
  },
});

export default MainPage;
