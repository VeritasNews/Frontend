import React, { useState, useEffect, useCallback } from "react";
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
  ToastAndroid,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { getArticleById, likeArticle, unlikeArticle, getLikedArticles, logInteraction } from "../utils/articleAPI";
import { getAuthToken } from "../utils/authAPI";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const NewsDetailScreen = ({ route, navigation }) => {
  const { articleId } = route.params;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  
  useEffect(() => {
    return () => {
      setArticle(null);
      setLiked(false);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("Screen focused, fetching article...", articleId);
      fetchArticle();
      
      return () => {
        console.log("Screen unfocused");
      };
    }, [articleId])
  );

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const [data, likedList] = await Promise.all([
        getArticleById(articleId),
        getLikedArticles(),
      ]);

      if (!data) {
        console.error("No article data returned for ID:", articleId);
        if (Platform.OS === 'android') {
          ToastAndroid.show('Failed to load article', ToastAndroid.LONG);
        } else {
          Alert.alert('Error', 'Failed to load article');
        }
        return;
      }

      setArticle(data);


      const apiArticleId = data.articleId || data.id;
      
      const isLiked = likedList && likedList.some(
        (item) => {
          const likedId = item.articleId || item.id;
          return likedId?.toString() === apiArticleId?.toString() || 
                 likedId?.toString() === articleId?.toString();
        }
      );
      
      setLiked(isLiked);
      
      logInteraction(articleId, 'view');
      
    } catch (error) {
      console.error("Error fetching article or likes:", error);
      
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to load article data', ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', 'Failed to load article data');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderWithBoldText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
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

  const handleLike = async () => {
    const updatedLiked = !liked;
    setLiked(updatedLiked);
  
    try {
      const token = await getAuthToken();
  
      if (!token) {
        console.warn("⚠️ No token found. User might not be logged in.");
        setLiked(!updatedLiked);
        
        if (Platform.OS === 'android') {
          ToastAndroid.show('Please log in to like articles', ToastAndroid.SHORT);
        } else {
          Alert.alert('Login Required', 'Please log in to like articles');
        }
        return;
      }
  
      if (updatedLiked) {
        await likeArticle(article.articleId, token);
        logInteraction(article.articleId, 'like');
      } else {
        await unlikeArticle(article.articleId, token);
        logInteraction(article.articleId, 'unlike');
      }
      
    } catch (err) {
      console.error("Like/unlike failed:", err);
      setLiked(!updatedLiked);
      
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to update like status', ToastAndroid.SHORT);
      } else {
        Alert.alert('Error', 'Failed to update like status');
      }
    }
  };
  
  const handleShare = async () => {
    try {
      await Share.share({ message: `${article.title}\n\n${article.summary || ""}` });
      logInteraction(article.articleId, 'share');
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
                {article.source && typeof article.source === 'string' 
                  ? article.source.replace(/[\[\]']+/g, "").split(",").map(s => s.trim()).join(", ")
                  : "Kaynak Bilinmiyor"}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.floatingButtons}>
        <TouchableOpacity onPress={handleLike} style={[styles.fab, liked ? styles.fabLiked : null]}>
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
  metaLabel: {
    fontWeight: "bold",
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
  fabLiked: {
    backgroundColor: "#a91101",
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