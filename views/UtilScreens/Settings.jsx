import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getPrivacySettings, updatePrivacySettings } from "../../utils/userAPI";
import COLORS from "../../theme/colors";
import FONTS from "../../theme/fonts";
import { GLOBAL_STYLES } from "../../theme/globalStyles";

const Settings = ({ navigation }) => {
  const [privacySettings, setPrivacySettings] = useState({
    liked_articles: "friends",
    reading_history: "private",
    friends_list: "public",
    profile_info: "public",
    activity_status: "friends"
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const options = ["public", "friends", "private"];

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const settings = await getPrivacySettings();
      setPrivacySettings(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const validateSettings = () => {
    const allowedValues = ["public", "friends", "private"];
    
    let isValid = true;
    const validatedSettings = {
      liked_articles: privacySettings.liked_articles || "private",
      reading_history: privacySettings.reading_history || "private",
      friends_list: privacySettings.friends_list || "private",
      profile_info: privacySettings.profile_info || "private",
      activity_status: privacySettings.activity_status || "private"
    };
    
    Object.entries(validatedSettings).forEach(([key, value]) => {
      if (!allowedValues.includes(value)) {
        console.error(`Invalid value for ${key}: ${value}`);
        isValid = false;
        validatedSettings[key] = "private";
      }
    });
    
    return { isValid, validatedSettings };
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const { isValid, validatedSettings } = validateSettings();
      
      if (!isValid) {
        alert("⚠️ Some settings have invalid values. Please check and try again.");
        setSaving(false);
        return;
      }
      
      console.log("Sending validated privacy settings:", validatedSettings);
      
      await updatePrivacySettings(validatedSettings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        
        const errorMessages = [];
        if (typeof error.response.data === 'object') {
          Object.entries(error.response.data).forEach(([field, errors]) => {
            if (Array.isArray(errors) && errors.length > 0) {
              errorMessages.push(`${field}: ${errors.join(', ')}`);
            }
          });
        }
        
        if (errorMessages.length > 0) {
          alert(`⚠️ Failed to update settings:\n${errorMessages.join('\n')}`);
        } else {
          alert(`⚠️ Failed to update settings: ${JSON.stringify(error.response.data) || 'Server returned an error'}`);
        }
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("⚠️ No response from server. Check your connection.");
      } else {
        alert(`⚠️ Error: ${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const SettingsIcon = ({ name }) => {
    let icon = "🔒";
    
    switch(name) {
      case "liked_articles": icon = "❤️"; break;
      case "reading_history": icon = "📚"; break;
      case "friends_list": icon = "👥"; break;
      case "profile_info": icon = "👤"; break;
      case "activity_status": icon = "🟢"; break;
      default: icon = "🔒";
    }
    
    return <Text style={styles.icon}>{icon}</Text>;
  };

  const renderPicker = (label, key) => {
    const currentValue = privacySettings[key] || "private";
    
    const getOptionDescription = (value) => {
      switch(value) {
        case "public": return "Everyone can see";
        case "friends": return "Only friends can see";
        case "private": return "Only you can see";
        default: return "";
      }
    };
    
    return (
      <View style={styles.setting}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.pickerWrapper}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerSelectedText}>
              {currentValue.charAt(0).toUpperCase() + currentValue.slice(1)}
            </Text>
            <Text style={styles.pickerDescription}>
              {getOptionDescription(currentValue)}
            </Text>
            <Picker
              selectedValue={currentValue}
              onValueChange={(value) =>
                setPrivacySettings((prev) => ({ ...prev, [key]: value }))
              }
              style={styles.hiddenPicker}
              dropdownIconColor={COLORS.primary}
            >
              {options.map((opt) => (
                <Picker.Item 
                  key={opt} 
                  label={opt.charAt(0).toUpperCase() + opt.slice(1)} 
                  value={opt}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>
    );
  };

  const renderSuccessMessage = () => {
    if (!showSuccess) return null;
    
    return (
      <View style={styles.successMessage}>
        <Text style={styles.successText}>✅ Settings updated successfully!</Text>
      </View>
    );
  };

  const settingsItems = [
    { label: "Liked Articles", key: "liked_articles" },
    { label: "Reading History", key: "reading_history" },
    { label: "Friends List", key: "friends_list" },
    { label: "Profile Info", key: "profile_info" },
    { label: "Activity Status", key: "activity_status" }
  ];

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Privacy Settings</Text>
          <View style={styles.spacer} />
        </View>
        <Text style={styles.subheader}>Control who can see your activity</Text>
        
        {renderSuccessMessage()}
        
        <View style={styles.settingsContainer}>
          {settingsItems.map(item => (
            <View key={item.key}>
              <View style={styles.settingRow}>
                <SettingsIcon name={item.key} />
                {renderPicker(item.label, item.key)}
              </View>
            </View>
          ))}
          
          <TouchableOpacity 
            style={[
              styles.saveButton,
              saving && styles.savingButton
            ]}
            onPress={saveSettings}
            activeOpacity={0.8}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Settings</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'stretch',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  header: {
    ...GLOBAL_STYLES.brandingTitle,
    fontSize: FONTS.sizes.large,
    textAlign: 'center',
    textTransform: 'none',
    color: COLORS.primary,
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.regular,
    fontWeight: FONTS.weights.semiBold,
  },
  spacer: {
    width: 40,
  },
  subheader: {
    ...GLOBAL_STYLES.brandingDate,
    textAlign: 'center',
    marginBottom: 24,
  },
  settingsContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
    width: '100%',
    ...GLOBAL_STYLES.shadow,
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  setting: {
    flex: 1,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.secondary,
    marginVertical: 12,
  },
  icon: {
    fontSize: 18,
    marginRight: 12,
  },
  label: {
    ...GLOBAL_STYLES.textBase,
    fontWeight: FONTS.weights.semiBold,
    marginBottom: 5,
  },
  pickerWrapper: {
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 4,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pickerSelectedText: {
    color: COLORS.primary,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.regular,
    paddingLeft: 5,
  },
  pickerDescription: {
    fontSize: FONTS.sizes.medium,
    color: COLORS.primary,
    paddingRight: 30,
    opacity: 0.85,
  },
  hiddenPicker: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: 40,
    opacity: 0,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 50,
  },
  savingButton: {
    backgroundColor: `${COLORS.primary}cc`,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: FONTS.weights.semiBold,
    fontSize: FONTS.sizes.regular,
    fontFamily: FONTS.families.primary,
  },
  loadingText: {
    ...GLOBAL_STYLES.textBase,
    marginTop: 10,
    color: COLORS.textMuted,
  },
  successMessage: {
    backgroundColor: 'rgba(75, 181, 67, 0.1)',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: 'rgba(75, 181, 67, 1)',
  },
  successText: {
    ...GLOBAL_STYLES.textBase,
    color: 'rgba(75, 181, 67, 1)',
  },
});

export default Settings;