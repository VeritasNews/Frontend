import React from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";
import { GLOBAL_STYLES, COLORS, FONTS } from "../theme/globalStyles";

const VeritasLogo = require("../assets/set2_no_bg.png");
const BahceliImage = require("../assets/bahceli.jpg");

const ScenarioTwo = () => {
  const currentDate = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const articles = [
    {
      title: "Nation Calm and Confident",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed interdum tortor.",
    },
    { title: "Trains Running", content: "Lorem ipsum dolor sit amet." },
    {
      title: "Foreign Views of the Strike",
      content: "Lorem ipsum dolor sit amet.",
    },
    {
      title: "Organized Menace",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    { title: "Picketers and Food", content: "Lorem ipsum dolor sit amet." },
    { title: "To Car Owners", content: "Lorem ipsum dolor sit amet." },
  ];

  return (
    <View style={styles.container}>
      {/* Main Article */}
      <View style={styles.mainArticle}>
        <Text style={styles.articleTitle}>{articles[0].title}</Text>
        <View style={styles.horizontalLine} />
        <Image source={BahceliImage} style={styles.articleImage} />
        <Text style={styles.articleText}>{articles[0].content}</Text>
      </View>

      {/* Smaller Articles */}
      <View style={styles.row2}>
        <View style={styles.smallArticle}>
          <Text style={styles.articleTitle}>{articles[1].title}</Text>
          <View style={styles.horizontalLine} />
          <Text style={styles.articleText}>{articles[1].content}</Text>
        </View>
        <View style={styles.mediumArticle}>
          <Text style={styles.articleTitle}>{articles[2].title}</Text>
          <View style={styles.horizontalLine} />
          <Text style={styles.articleText}>{articles[2].content}</Text>
        </View>
      </View>
      <View style={styles.row2}>
        <View style={styles.smallArticle}>
          <Text style={styles.articleTitle}>{articles[3].title}</Text>
          <View style={styles.horizontalLine} />
          <Text style={styles.articleText}>{articles[3].content}</Text>
        </View>
        <View style={styles.smallArticle}>
          <Text style={styles.articleTitle}>{articles[4].title}</Text>
          <View style={styles.horizontalLine} />
          <Text style={styles.articleText}>{articles[4].content}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logoTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 8,
    resizeMode: "contain",
  },
  title: {
    fontSize: FONTS.sizes.xLarge,
    fontFamily: "OldStandard-Bold",
    color: COLORS.textDefault,
  },
  date: {
    fontSize: FONTS.sizes.small,
    fontFamily: "OldStandard",
    color: COLORS.textMuted,
    marginTop: 4,
  },
  articleImage: {
    width: 150,
    height: 150,
    resizeMode: "cover",
    marginVertical: 8,
    borderRadius: 4,
  },
  contentBackground: {
    flex: 1,
    padding: 16,
  },
  mainArticle: {
    padding: 2,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: 2,
    elevation: 3,
    minHeight: 250,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },
  row2: {
    flexDirection: "row",
    marginRight: 20,
    alignItems: "center",
  },
  smallArticle: {
    width: "48%",
    padding: 2,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 3,
    minHeight: 120,
    marginRight: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  mediumArticle: {
    width: "48%",
    padding: 2,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    elevation: 3,
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  articleTitle: {
    fontSize: FONTS.sizes.large,
    fontFamily: "OldStandard-Bold",
    color: COLORS.default,
    marginBottom: 8,
    textAlign: "center",
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#000",
    width: "100%",
  },
  articleText: {
    fontSize: FONTS.sizes.regular,
    fontFamily: "OldStandard",
    color: COLORS.textMuted,
    lineHeight: 20,
    textAlign: "center",
  },
});

export default ScenarioTwo;
