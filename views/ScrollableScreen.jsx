import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, Platform } from "react-native";

const articles = [
  {
    title: "Growing Support for Strikers",
    content: "Public support for the strike grows as more citizens join the protests, pushing for systemic changes.",
  },
  {
    title: "Government Stance",
    content: "Government officials remain firm in their stance, calling for an end to disruptions and a return to normalcy.",
  },
  {
    title: "Protestors Face Resistance",
    content: "Despite widespread support, protestors face significant resistance from law enforcement, leading to escalating tensions.",
    image: require("../assets/image1.jpg"),
  },
  {
    title: "Economic Impact of Strikes",
    content: "The strikes have begun to affect the local economy, with businesses reporting losses as transportation halts.",
    image: require("../assets/image3.jpg"),
  },
  {
    title: "Calls for Negotiation",
    content: "Both sides agree on the need for negotiation, with talks scheduled to begin next week to resolve the ongoing crisis.",
  },
  {
    title: "Bahçeli, Öcalan'ı Meclis'te Konuşmaya Çağırıyor: Silah Bırakımını İlan Etsin",
    content: "MHP lideri Bahçeli, Öcalan'ın Meclis'te DEM partisine gelerek terörün sonlandığını ilan etmesini istedi. Bu adımın \"umut hakkı\" yasasıyla Öcalan'ın serbest kalmasının önünü açabileceğini belirtti. Bahçeli, terörle mücadelede ortak aklı ve milli birliği savundu.",
    image: require("../assets/bahceli.jpg"),
  },
];

const ScrollableScreen = () => {
  const renderArticle = (article, index) => {
    return (
      <View key={index} style={styles.article}>
        <Text style={[styles.articleTitle, article.title === "Growing Support for Strikers" && styles.largeTitle]}>
          {article.title}
        </Text>
        <View style={styles.contentContainer}>
          {article.image && <Image source={article.image} style={styles.articleImage} />}
          <View style={styles.horizontalLine} />
          <Text style={styles.articleText}>{article.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.centerContainer}>
        {/* This is the "Workers Demand Better Conditions" article with image on the side */}
        <View style={styles.article}>
          <Text style={styles.articleTitle}>Workers Demand Better Conditions</Text>
          <View style={styles.contentContainerRow}>
            <Image source={require("../assets/image2.jpg")} style={styles.articleImageSide} />
            <View style={styles.contentTextContainer}>
              <Text style={styles.articleText}>
                Striking workers demand better wages and working conditions, sparking debates about labor rights across the nation.
              </Text>
            </View>
          </View>
        </View>

        {/* Render remaining articles */}
        {articles.map((article, index) => {
          if (article.title !== "Workers Demand Better Conditions") {
            return renderArticle(article, index);
          }
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 3,
    backgroundColor: "#f4f4f4",
    flexGrow: 1, // Ensure ScrollView content stretches when the content is less
  },
  centerContainer: {
    flexDirection: "column", // Adjusted to single column for better readability
    width: "100%",
    ...Platform.select({
      web: {
        maxWidth: 1200,
        marginHorizontal: "auto",
      },
      default: {
        width: "100%",
      },
    }),
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
    marginBottom: 5,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#333",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    paddingBottom: 4,
  },
  largeTitle: {
    fontSize: 18,
    color: "#000",
  },
  contentContainer: {
    backgroundColor: "#D9D9D9",
    borderRadius: 4,
    padding: 8,
  },
  contentContainerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  articleImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 16 / 9,
    maxHeight: 200,
    borderRadius: 4,
    marginBottom: 8,
    resizeMode: "cover",
  },
  articleImageSide: {
    width: 120,
    height: 100,
    borderRadius: 4,
    marginRight: 16,
    resizeMode: "cover",
  },
  contentTextContainer: {
    flex: 1,
  },
  articleText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 18,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 8,
  },
});

export default ScrollableScreen;
