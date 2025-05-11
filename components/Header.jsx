import React from "react";
import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
import { useFonts, VT323_400Regular } from '@expo-google-fonts/vt323';
import AppLoading from 'expo-app-loading'; // To show splash while loading font
const VeritasLogo = require("../assets/set2_no_bg.png"); // Adjust path if needed

const Header = () => {
  const [fontsLoaded] = useFonts({
    VT323_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const formatTurkishDate = () => {
    const now = new Date();
    const weekday = now.toLocaleDateString("tr-TR", { weekday: "long" });
    const dayMonth = now.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
    });
    const year = now.getFullYear();
    return `${capitalize(weekday)} • ${capitalize(dayMonth)} ${year}`;
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerLine} />
      <View style={styles.header}>
        <Image source={VeritasLogo} style={styles.logo} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Veritas</Text>
          <Text style={styles.date}>{formatTurkishDate()}</Text>

        </View>
      </View>
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
    width: 65,
    height: 65,
    resizeMode: "contain",
    marginRight: 10, // Space between logo and text
  },
  textContainer: {
    alignItems: "center", // Centers the title and date
  },
  title: {
    fontSize: 40,
    fontWeight: "400",
    color: "#a91101",
    fontFamily: "Georgia-bold",
  },
  date: {
    fontSize: 13,
    color: "#555",
    fontFamily: "OldStandard",
    letterSpacing: 1.2,
    marginTop: 2,
  },
  
});

export default Header;
