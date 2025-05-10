import React, { useState, useCallback } from "react";
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
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import { getArticleById, likeArticle, unlikeArticle, getLikedArticles, logInteraction } from "../utils/articleAPI";
import { getAuthToken } from "../utils/authAPI";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const NewsDetailScreen = ({ route, navigation }) => {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  
  useFocusEffect(
    useCallback(() => {
      fetchArticle();
      return () => {};
    }, [articleId])
  );

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const [data, likedList] = await Promise.all([
        getArticleById(articleId),
        getLikedArticles().catch(() => []),
      ]);

      if (!data) {
        console.error("No article data returned for ID:", articleId);
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
      logInteraction(data.id, 'view').catch(() => {});
      
    } catch (error) {
      console.error("Error fetching article:", error);
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
        console.warn("No token found. User might not be logged in.");
        setLiked(!updatedLiked);
        return;
      }
  
      if (updatedLiked) {
        await likeArticle(article.articleId, token);
        await logInteraction(article.id, 'like');
      } else {
        await unlikeArticle(article.articleId, token);
        await logInteraction(article.id, 'unlike');
      }
    } catch (err) {
      console.error("Like/unlike failed:", err);
      setLiked(!updatedLiked);
    }
  };
  
  const handleShare = async () => {
    try {
      await Share.share({ message: `${article.title}\n\n${article.summary || ""}` });
      logInteraction(article.id, 'share');
    } catch (error) {
      console.error("Error sharing article:", error);
    }
  };
  
  if (loading || !article) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size={Platform.OS === 'android' ? 48 : 'large'} 
            color="#a91101" 
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={[
            styles.backButton, 
            Platform.OS === 'android' ? styles.backButtonAndroid : styles.backButtonIOS
          ]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        
        {/* Main Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
          bounces={Platform.OS === 'ios'}
          overScrollMode={Platform.OS === 'android' ? 'always' : undefined}
          indicatorStyle={Platform.OS === 'ios' ? 'black' : undefined}
        >
          {/* Article Image */}
          {article.image ? (
            <Image 
              source={{ uri: article.image }} 
              style={styles.image} 
              resizeMode="cover" 
            />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name="image" size={48} color="#aaa" />
            </View>
          )}
          
          {/* Article Title Card */}
          <View style={styles.infoCard}>
            <Text style={styles.title}>{article.title}</Text>
            <Text style={styles.metaText}>
              {article.createdAt
                ? new Date(article.createdAt).toDateString()
                : "Tarih Bilinmiyor"}
            </Text>
          </View>
          
          {/* Article Content Card */}
          <View style={styles.contentCard}>
            <Text style={styles.summary}>
              {renderWithBoldText(article.longerSummary)}
            </Text>
            
            <View style={styles.metaBottomRow}>
              <MaterialCommunityIcons name="folder-outline" size={18} color="#666" />
              <Text style={styles.metaRowText}>
                <Text style={styles.metaLabel}>Kategori:</Text> {article.category}
              </Text>
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
            
            {/* Space at the bottom to ensure content isn't hidden behind buttons */}
            <View style={styles.bottomSpace} />
          </View>
        </ScrollView>
        
        {/* Floating Action Buttons */}
        <View style={styles.floatingButtons}>
          <TouchableOpacity 
            onPress={handleLike} 
            style={[styles.fab, liked ? styles.fabLiked : null]}
            activeOpacity={0.8}
          >
            <Ionicons name={liked ? "heart" : "heart-outline"} size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleShare} 
            style={styles.fab}
            activeOpacity={0.8}
          >
            <Ionicons name="share-social-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 8,
    borderRadius: 20,
  },
  backButtonIOS: {
    top: 10,
    left: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  backButtonAndroid: {
    top: 20,
    left: 20,
    elevation: 4,
  },
  image: {
    width: width,
    height: 350,
    backgroundColor: "#eee",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 10,
    marginTop: -40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
    ...Platform.select({
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  metaText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  contentCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 15,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  summary: {
    fontSize: 15,
    color: "#333",
    paddingHorizontal: 0,
    paddingTop: 10,
    lineHeight: 22,
    ...Platform.select({
      android: {
        lineHeight: 24, // Android needs slightly larger line height for readability
      },
    }),
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
  bottomSpace: {
    height: 60,
  },
  floatingButtons: {
    position: "absolute",
    bottom: 30,
    right: 20,
    flexDirection: "column",
    gap: 12,
    zIndex: 10,
  },
  fab: {
    backgroundColor: "#a91101",
    borderRadius: 30,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  fabLiked: {
    backgroundColor: "#a91101",
  },
});

export default NewsDetailScreen;