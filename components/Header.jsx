import React from "react";
import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";

const VeritasLogo = require("../assets/set2_no_bg.png"); // Adjust path if needed

const Header = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Border Line */}
      <View style={styles.headerLine} />

      {/* Header Content */}
      <View style={styles.header}>
        <Image source={VeritasLogo} style={styles.logo} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Veritas</Text>
          <Text style={styles.date}>{new Date().toDateString()}</Text>
        </View>
      </View>

      {/* Bottom Border Line */}
      <View style={styles.headerLine} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    width: "100%",
    backgroundColor: "#fff",
  },
  headerLine: {
    height: 1,
    backgroundColor: "#141413",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center", // Centers items vertically
    justifyContent: "center", // Centers all items
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    marginRight: 10, // Space between logo and text
  },
  textContainer: {
    alignItems: "center", // Centers the title and date
  },
  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#a91101",
    fontFamily: "OldStandard-Bold",
  },
  date: {
    fontSize: 14,
    color: "#888",
    fontFamily: "OldStandard",
  },
});

export default Header;
