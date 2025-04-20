import React, { useState, useEffect } from "react";
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
  Image,
  ActivityIndicator
} from "react-native";
import { registerUser, saveAuthToken, registerSocialUser } from "../../utils/api"; 
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import Auth0 from 'react-native-auth0';

const GOOGLE_WEB_CLIENT_ID = '13432528572-pjavjgun26jai1738s8i6d5c3nodt39i.apps.googleusercontent.com';

const AUTH0_DOMAIN = 'dev-dh2ecmgppfypyjdc.us.auth0.com';
const AUTH0_CLIENT_ID = 'gwwb1lj3Fe1GY2hNog8xmHBeBMA3gfR9';

const auth0 = new Auth0({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID
});

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID, // Your Google Web Client ID
      offlineAccess: true,
    });
  }, []);

  // Regular email/password registration
  const handleRegister = async () => {
    if (!email || !name || !password) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await registerUser(email, name, password, username);
      console.log("Registration successful:", response);
      // Save authentication token
      await saveAuthToken(response.access);
      // Navigate to ChooseCategoryScreen
      navigation.navigate("ChooseCategoryScreen");
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // Send Google token to your backend
      const response = await registerSocialUser({
        provider: 'google',
        token: userInfo.idToken,
        email: userInfo.user.email,
        name: userInfo.user.name
      });
      
      await saveAuthToken(response.access);
      navigation.navigate("ChooseCategoryScreen");
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Google sign in was cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Google sign in is already in progress');
      } else {
        console.error('Google sign in error:', error);
        Alert.alert('Google Sign In Error', 'An error occurred with Google Sign In.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Facebook Sign-In
  const handleFacebookSignIn = async () => {
    try {
      setLoading(true);
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }
      
      // Get access token
      const data = await AccessToken.getCurrentAccessToken();
      
      if (!data) {
        throw new Error('Something went wrong obtaining the access token');
      }
      
      // Send Facebook token to your backend
      const response = await registerSocialUser({
        provider: 'facebook',
        token: data.accessToken.toString(),
      });
      
      await saveAuthToken(response.access);
      navigation.navigate("ChooseCategoryScreen");
    } catch (error) {
      console.error('Facebook sign in error:', error);
      Alert.alert('Facebook Sign In Error', 'An error occurred with Facebook Sign In.');
    } finally {
      setLoading(false);
    }
  };

  // Apple Sign-In (iOS only)
  const handleAppleSignIn = async () => {
    // Check if Apple Authentication is supported on this device
    if (!appleAuth.isSupported) {
      Alert.alert('Error', 'Apple Sign In is not supported on this device');
      return;
    }
    
    try {
      setLoading(true);
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      
      const { identityToken, fullName } = appleAuthRequestResponse;
      
      if (!identityToken) {
        throw new Error('Apple Sign In failed - no identity token returned');
      }
      
      // Handle name (may be null if user has signed in before)
      const fullNameString = fullName ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim() : '';
      
      // Send Apple token to your backend
      const response = await registerSocialUser({
        provider: 'apple',
        token: identityToken,
        name: fullNameString || null,
      });
      
      await saveAuthToken(response.access);
      navigation.navigate("ChooseCategoryScreen");
    } catch (error) {
      console.error('Apple sign in error:', error);
      Alert.alert('Apple Sign In Error', 'An error occurred with Apple Sign In.');
    } finally {
      setLoading(false);
    }
  };

  // Twitter/X Sign-In (using Auth0)
  const handleTwitterSignIn = async () => {
    try {
      setLoading(true);
      const credentials = await auth0.webAuth.authorize({
        connection: 'twitter',
        scope: 'openid profile email',
      });
      
      // Send Auth0 token to your backend
      const response = await registerSocialUser({
        provider: 'twitter',
        token: credentials.idToken,
      });
      
      await saveAuthToken(response.access);
      navigation.navigate("ChooseCategoryScreen");
    } catch (error) {
      console.error('Twitter sign in error:', error);
      Alert.alert('Twitter Sign In Error', 'An error occurred with Twitter Sign In.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            {/* Back button */}
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            {/* Social Sign-up Options */}
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <View style={styles.socialButtonContent}>
                <Image 
                  source={require('../../assets/google-icon.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Sign up with Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleFacebookSignIn}
              disabled={loading}
            >
              <View style={styles.socialButtonContent}>
                <Image 
                  source={require('../../assets/facebook-icon.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Sign up with Facebook</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              <View style={styles.socialButtonContent}>
                <Image 
                  source={require('../../assets/apple-icon.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Sign up with Apple</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleTwitterSignIn}
              disabled={loading}
            >
              <View style={styles.socialButtonContent}>
                <Image 
                  source={require('../../assets/x-icon.png')}
                  style={styles.socialIcon}
                />
                <Text style={styles.socialButtonText}>Sign up with X</Text>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Registration Form */}
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

              {/* Terms agreement text */}
              <Text style={styles.termsText}>
                By creating your account, you agree to the{' '}
                <Text style={styles.linkText} onPress={() => navigation.navigate('TermsOfService')}>Terms of Service</Text> and{' '}
                <Text style={styles.linkText} onPress={() => navigation.navigate('PrivacyPolicy')}>Privacy Policy</Text>
              </Text>

              {/* Create Account Button */}
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: '#333',
  },
  socialButton: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDDDDD',
  },
  dividerText: {
    paddingHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    lineHeight: 20,
  },
  linkText: {
    color: '#B00020',
    textDecorationLine: 'underline',
  },
  createAccountButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#B00020',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#D8A0A8',
  },
});

export default Register;