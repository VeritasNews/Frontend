import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { loginUser, saveAuthToken, saveRefreshToken } from '../../utils/authAPI';

const Login = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    identifier: '',
    password: '',
    general: ''
  });

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate inputs before submission
  const validateInputs = () => {
    let isValid = true;
    const newErrors = {
      identifier: '',
      password: '',
      general: ''
    };

    // Check if fields are empty
    if (!identifier.trim()) {
      newErrors.identifier = 'Email or username is required';
      isValid = false;
    } else if (identifier.includes('@') && !isValidEmail(identifier)) {
      newErrors.identifier = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    // Clear previous error messages
    setErrors({
      identifier: '',
      password: '',
      general: ''
    });

    // Validate inputs
    if (!validateInputs()) {
      return;
    }
  
    try {
      setLoading(true);
      console.time("login");
      
      // Check network connectivity
      const networkState = await NetInfo.fetch();
      if (!networkState.isConnected) {
        setErrors({ general: 'No internet connection. Please check your network settings.' });
        return;
      }
      
      const response = await loginUser(identifier, password);
      console.timeEnd("login");

      await saveAuthToken(response.access);
      await saveRefreshToken(response.refresh);
      console.time("navigate");
      navigation.navigate('ForYouPersonalized');
      console.timeEnd("navigate");
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error types
      if (error.response && error.response.status) {
        const status = error.response.status;
        if (status === 401) {
          setErrors({ general: 'Invalid username or password. Please try again.' });
        } else if (status === 403) {
          setErrors({ general: 'Your account has been locked. Please contact support.' });
        } else if (status === 404) {
          setErrors({ general: 'Account not found. Please check your credentials or create a new account.' });
        } else if (status === 429) {
          setErrors({ general: 'Too many failed attempts. Please try again later.' });
        } else if (status >= 500) {
          setErrors({ general: 'Server error. Please try again later or contact support.' });
        }
      } else if (error.message) {
        if (error.message.includes('Network Error') || error.message.includes('timeout')) {
          setErrors({ general: 'Network error. Please check your internet connection and try again.' });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateAccount = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/set2_no_bg.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            
            <Text style={styles.welcomeText}>
              Welcome to Veritas
            </Text>
            
            <Text style={styles.taglineText}>
                Where Facts Find Their Voice.
            </Text>
            
            <View style={styles.formContainer}>
              {/* Display general error message */}
              {errors.general ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.general}</Text>
                </View>
              ) : null}
            
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, errors.identifier ? styles.inputError : null]}
                  placeholder="Email or Username"
                  value={identifier}
                  onChangeText={(text) => {
                    setIdentifier(text);
                    if (errors.identifier) {
                      setErrors({...errors, identifier: ''});
                    }
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {errors.identifier ? (
                  <Text style={styles.fieldErrorText}>{errors.identifier}</Text>
                ) : null}
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, errors.password ? styles.inputError : null]}
                  placeholder="Password"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errors.password) {
                      setErrors({...errors, password: ''});
                    }
                  }}
                  secureTextEntry
                />
                {errors.password ? (
                  <Text style={styles.fieldErrorText}>{errors.password}</Text>
                ) : null}
              </View>
              
              {/* Forgot Password Link */}
              <TouchableOpacity 
                style={styles.forgotPasswordContainer}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.loginButton, loading ? styles.loginButtonDisabled : null]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              {/* Create Account Button */}
              <TouchableOpacity 
                style={styles.createAccountButton}
                onPress={handleCreateAccount}
                disabled={loading}
              >
                <Text style={styles.createAccountButtonText}>Create Account</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.guestButton}
                onPress={() => navigation.navigate('ForYou')}
                disabled={loading}
                >
                <Text style={styles.guestButtonText}>Continue without registering</Text>
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
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    width: 200,
    height: 100,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '150%',
    height: '150%',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  taglineText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 12,
    width: '100%',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#a91101',
    borderWidth: 1,
  },
  errorContainer: {
    backgroundColor: '#fde2e2',
    borderWidth: 1,
    borderColor: '#a91101',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#a91101',
    textAlign: 'center',
    fontSize: 14,
  },
  fieldErrorText: {
    color: '#a91101',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#8b0d01',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    backgroundColor: "#a91101",
    borderColor: "#8b0d01",
    borderRadius: 6,
    paddingVertical: 14,
    marginBottom: 16,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: "#d27971",
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  createAccountButton: {
    width: '100%',
    borderColor: "#8b0d01",
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: '#8b0d01',
    fontSize: 16,
    fontWeight: '600',
  },
  guestButton: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    borderColor: "#d4d4d4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  guestButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Login;