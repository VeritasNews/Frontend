import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import COLORS from "../../theme/colors"; 
import { savePreferredCategories, getAuthToken } from "../../utils/api";

const categories = [
  "Siyaset", "Eğlence", "Spor", "Teknoloji", "Sağlık", "Çevre", "Bilim", "Eğitim",
  "Ekonomi", "Seyahat", "Moda", "Kültür", "Suç", "Yemek", "Yaşam Tarzı", "İş Dünyası",
  "Dünya Haberleri", "Oyun", "Otomotiv", "Sanat", "Tarih", "Uzay", "İlişkiler", "Din",
  "Ruh Sağlığı", "Magazin"
];

const ChooseCategoryScreen = ({ navigation }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = await getAuthToken();
    if (!token) {
      Alert.alert("Unauthorized", "Please log in again.");
      navigation.navigate("Login");
    }
  };

  const handleToggle = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleContinue = async () => {
    if (selectedTopics.length < 5) {
      Alert.alert("Selection Required", "Please pick at least 5 categories.");
      return;
    }

    try {
      await savePreferredCategories(selectedTopics);
      Alert.alert("Success", "Preferences saved successfully!");
      navigation.navigate("ForYou"); // Redirect to the main feed
    } catch (error) {
      Alert.alert("Error", "Failed to save preferences.");
      console.error("API Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick 5 or more</Text>
      <Text style={styles.subtitle}>You can always add new topics later</Text>
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.topicButton,
              selectedTopics.includes(category) && styles.activeTopic,
            ]}
            onPress={() => handleToggle(category)}
          >
            <Text
              style={[
                styles.topicText,
                selectedTopics.includes(category) && styles.activeTopicText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedTopics.length < 5 && (
        <Text style={styles.warningText}>
          Please select at least 5 categories to continue.
        </Text>
      )}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20, alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", color: COLORS.textDefault, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  topicButton: {
    backgroundColor: COLORS.secondary, borderWidth: 1, borderColor: COLORS.border,
    paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, margin: 5
  },
  activeTopic: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  topicText: { fontSize: 14, color: COLORS.textDefault },
  activeTopicText: { color: COLORS.white, fontWeight: "bold" },
  continueButton: { backgroundColor: COLORS.primary, padding: 10, borderRadius: 8, marginTop: 20 },
  continueText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
  warningText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  
});

export default ChooseCategoryScreen;
