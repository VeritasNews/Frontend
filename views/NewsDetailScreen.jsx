import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getArticleById } from "../utils/api"; // 🧠 You need to implement this if not done

const NewsDetailScreen = ({ route, navigation }) => {
  const { articleId } = route.params;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const data = await getArticleById(articleId);
      setArticle(data);
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderWithBoldText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g); // Split by **bold**
  
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text key={index} style={{ fontWeight: "bold" }}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });
  };  

  const handleLike = () => {
    setLiked(!liked);
    // 🔜 Hook up to backend later
  };

  if (loading || !article) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#333" />
      </TouchableOpacity>

      {article.image ? (
        <Image source={{ uri: article.image }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="image" size={48} color="#aaa" />
        </View>
      )}

      <View style={styles.infoCard}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.metaText}>
          {new Date(article.createdAt).toDateString()}
        </Text>
        <Text style={styles.metaText}>Category: {article.category}</Text>
        <Text style={styles.metaText}>Source: {article.source}</Text>
      </View>

      <Text style={styles.summary}>{renderWithBoldText(article.longerSummary)}</Text>
      <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
        <Ionicons name={liked ? "heart" : "heart-outline"} size={28} color="white" />
      </TouchableOpacity>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginTop: Platform.OS === "ios" ? 60 : 40,
    marginLeft: 20,
    position: "absolute",
    zIndex: 2,
  },
  image: {
    width: "100%",
    height: 220,
    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  likeButton: {
    position: "absolute",
    right: 20,
    top: 200,
    backgroundColor: "#a91101",
    borderRadius: 30,
    padding: 12,
    elevation: 5,
    zIndex: 2,
  },
  infoCard: {
    backgroundColor: "#f8f8f8",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 10,
    marginTop: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  summary: {
    fontSize: 15,
    color: "#333",
    paddingHorizontal: 16,
    paddingTop: 20,
    lineHeight: 22,
  },
});

export default NewsDetailScreen;
