import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";
import { Picker } from '@react-native-picker/picker'; // Use this if you're using @react-native-picker
import { getAuthToken } from "../../utils/authAPI"; // ✅ Adjust the path if needed

const BASE_URL = "http://139.179.221.240:8000/api/";

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
      const token = await getAuthToken();
      const res = await axios.get(`${BASE_URL}me/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrivacySettings(res.data.privacySettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const updateSettings = async () => {
    try {
      const token = await getAuthToken();
      await axios.patch(`${BASE_URL}user/privacy/`, {
        privacySettings
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Privacy settings updated!");
    } catch (error) {
      console.error("Error updating settings:", error);
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
        onValueChange={(value) => setPrivacySettings(prev => ({ ...prev, [key]: value }))}
      >
        {options.map(opt => (
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

      <Button title="Save Settings" onPress={updateSettings} />
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
