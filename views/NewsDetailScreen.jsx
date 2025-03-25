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
  Share,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getArticleById } from "../utils/api"; // 🧠 You need to implement this if not done
import { COLORS } from '../theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.summary || ""}`,
      });
    } catch (error) {
      console.error("Error sharing article:", error);
    }
  };
  
  if (loading || !article) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
    <Pressable style={styles.container} onPress={() => navigation.goBack()}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
      >
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
            {article.createdAt
              ? new Date(article.createdAt).toDateString()
              : "Tarih Bilinmiyor"}
          </Text>
        </View>
  
        <View style={styles.contentCard}>
          <Text style={styles.summary}>
            {renderWithBoldText(article.longerSummary)}
          </Text>
  
          <View style={styles.metaBottomRow}>
            <MaterialCommunityIcons name="folder-outline" size={18} color="#666" />
            <Text style={styles.metaRowText}><Text style={styles.metaLabel}>Kategori:</Text> {article.category}</Text>
            </View>
            <View style={styles.metaBottomRow}>
            <MaterialCommunityIcons name="newspaper-variant-outline" size={18} color="#666" />
            <Text style={styles.metaRowText}>
                <Text style={styles.metaLabel}>Kaynak:</Text>{" "}
                {article.source.replace(/[\[\]']+/g, "").split(",").map(s => s.trim()).join(", ")}
            </Text>
        </View>

        </View>
      </ScrollView>
  </Pressable>
      <View style={styles.floatingButtons}>
        <TouchableOpacity onPress={handleLike} style={styles.fab}>
          <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.fab}>
          <Ionicons name="share-social-outline" size={22} color="white" />
        </TouchableOpacity>
      </View>
    </View>
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
    height: 220,
    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 40,
    padding: 16,
    borderRadius: 10,
    marginTop: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
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
    paddingHorizontal: 0,
    paddingTop: 10,
    lineHeight: 22,
  },
  metaBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 6,
  },
  metaRowText: {
    fontSize: 13,
    color: "#666",
  },
  contentCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  floatingButtons: {
    position: "absolute",
    bottom: 30,
    right: 20,
    flexDirection: "column",
    gap: 12,
  },
  fab: {
    backgroundColor: "#a91101",
    borderRadius: 30,
    padding: 14,
    elevation: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 30,
    flexGrow: 1,
    minHeight: "100%",
    backgroundColor: "#fff",
  },
  
});

export default NewsDetailScreen;
