import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { registerUser, saveAuthToken } from "../../utils/api";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!email || !name || !password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(email, name, username, password);
      await saveAuthToken(response.access);
      navigation.navigate("ChooseCategoryScreen");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Username (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                editable={!loading}
              />

              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                editable={!loading}
              />

              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter e-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />

              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={togglePasswordVisibility}
                  disabled={loading}
                >
                  <Text>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.termsText}>
                By creating your account, you agree to the{" "}
                <Text style={styles.linkText} onPress={() => navigation.navigate("TermsOfService")}>
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text style={styles.linkText} onPress={() => navigation.navigate("PrivacyPolicy")}>
                  Privacy Policy
                </Text>
              </Text>

              <TouchableOpacity
                style={[styles.createAccountButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.createAccountButtonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  scrollContainer: { flexGrow: 1, paddingBottom: 30 },
  contentContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  backButton: { alignSelf: "flex-start", marginBottom: 20 },
  backButtonText: { fontSize: 24, color: "#333" },
  formContainer: { width: "100%" },
  inputLabel: { fontSize: 14, color: "#333", marginBottom: 5 },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  termsText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
    lineHeight: 20,
  },
  linkText: {
    color: "#B00020",
    textDecorationLine: "underline",
  },
  createAccountButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#B00020",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  createAccountButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#D8A0A8",
  },
});

export default Register;
