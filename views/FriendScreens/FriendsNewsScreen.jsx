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
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import CategoryBar from "../../components/CategoryBar";
import { getFriendsLikedArticles } from "../../utils/api"; // ✅ new API call

const FriendsNewsScreen = ({ navigation }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const isPortrait = Dimensions.get("window").height >= Dimensions.get("window").width;

  useEffect(() => {
    loadArticles();
    const listener = Dimensions.addEventListener("change", () => {
      const portrait = Dimensions.get("window").height >= Dimensions.get("window").width;
      setPortrait(portrait);
    });

    return () => listener?.remove();
  }, []);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getFriendsLikedArticles(); // ✅
      setArticles(data);
    } catch (err) {
      console.error("Error loading friends' liked articles", err);
    } finally {
      setLoading(false);
    }
  };

  const renderNewsCard = (item) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("NewsDetail", { articleId: item.id })}
    >
      <View style={styles.newsCard}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        {item.summary && <Text style={styles.newsSummary}>{item.summary}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 10 }}
      >
        <Header />
        <CategoryBar navigation={navigation} />
        <Text style={styles.heading}>Articles Your Friends Liked</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#a91101" style={{ marginTop: 20 }} />
        ) : articles.length === 0 ? (
          <Text style={styles.empty}>No liked articles found.</Text>
        ) : (
          articles.map((item) => (
            <View key={item.id} style={{ marginBottom: 12 }}>
              {renderNewsCard(item)}
            </View>
          ))
        )}
      </ScrollView>
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
  },
  newsCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  newsSummary: {
    fontSize: 13,
    color: "#444",
    marginTop: 6,
  },
  empty: {
    fontStyle: "italic",
    color: "#999",
    textAlign: "center",
    marginTop: 20,
  },
});

export default FriendsNewsScreen;
