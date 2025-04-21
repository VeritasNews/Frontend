import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { getLikedArticles } from "../utils/articleAPI";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

const LikedArticlesScreen = () => {
  const [likedArticles, setLikedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchLikedArticles();
  }, []);

  const fetchLikedArticles = async () => {
    try {
      setLoading(true);
      const articles = await getLikedArticles();
      setLikedArticles(articles);
    } catch (error) {
      console.error("Error fetching liked articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate("NewsDetailScreen", { articleId: item.articleId })}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="image-outline" size={40} color="#aaa" />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary || "Özet bulunamadı"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#a91101" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={likedArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.articleId}
        contentContainerStyle={{ padding: 10 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Henüz beğendiğiniz bir haber yok.</Text>}
      />
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    articleCard: {
      flexDirection: "row",
      backgroundColor: "#f9f9f9",
      borderRadius: 10,
      marginBottom: 10,
      overflow: "hidden",
      elevation: 2,
    },
    image: {
      width: 100,
      height: 100,
    },
    placeholder: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#eee",
    },
    content: {
      flex: 1,
      padding: 10,
      justifyContent: "center",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#222",
    },
    summary: {
      fontSize: 14,
      color: "#666",
      marginTop: 4,
    },
    emptyText: {
      textAlign: "center",
      marginTop: 50,
      fontSize: 16,
      color: "#999",
    },
  });
  

export default LikedArticlesScreen;
