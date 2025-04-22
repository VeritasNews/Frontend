import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getPrivacySettings, updatePrivacySettings } from "../../utils/userAPI";

const Settings = ({ navigation }) => {
  const [privacySettings, setPrivacySettings] = useState({
    liked_articles: "friends",
    reading_history: "private",
    friends_list: "public",
    profile_info: "public",
    activity_status: "friends"
  });

  const options = ["public", "friends", "private"];

  const fetchSettings = async () => {
    try {
      const settings = await getPrivacySettings();
      setPrivacySettings(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const saveSettings = async () => {
    try {
      await updatePrivacySettings(privacySettings);
      alert("✅ Privacy settings updated!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("⚠️ Failed to update settings.");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const renderPicker = (label, key) => (
    <View style={styles.setting} key={key}>
      <Text style={styles.label}>{label}</Text>
      <Picker
        selectedValue={privacySettings[key]}
        onValueChange={(value) =>
          setPrivacySettings((prev) => ({ ...prev, [key]: value }))
        }
      >
        {options.map((opt) => (
          <Picker.Item key={opt} label={opt} value={opt} />
        ))}
      </Picker>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔐 Privacy Settings</Text>
      {renderPicker("Liked Articles", "liked_articles")}
      {renderPicker("Reading History", "reading_history")}
      {renderPicker("Friends List", "friends_list")}
      {renderPicker("Profile Info", "profile_info")}
      {renderPicker("Activity Status", "activity_status")}
      <Button title="Save Settings" onPress={saveSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  setting: { marginBottom: 15 },
  label: { fontWeight: "bold", marginBottom: 5 },
  header: { fontSize: 22, marginBottom: 20 }
});

export default Settings;
