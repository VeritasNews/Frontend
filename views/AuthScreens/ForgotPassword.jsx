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
import { requestPasswordReset } from '../../utils/authAPI';

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetRequest = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
  
    try {
      setLoading(true);
      setError('');
      await requestPasswordReset(email);
      setSuccess(true);
    } catch (error) {
      setError(error.message || 'Failed to send password reset request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Image
            source={require('../../assets/set2_no_bg.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent instructions to reset your password to {email}.
              Please check your inbox and follow the link to reset your password.
            </Text>
            
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.loginButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
              Forgot Password
            </Text>
            
            <Text style={styles.taglineText}>
              Enter your email to receive password reset instructions.
            </Text>
            
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleResetRequest}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Send Reset Link</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.createAccountButton}
                onPress={handleBackToLogin}
                disabled={loading}
              >
                <Text style={styles.createAccountButtonText}>Back to Login</Text>
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
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    fontSize: 16,
  },
  errorText: {
    color: '#a91101',
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    width: '100%',
    backgroundColor: "#a91101",
    borderColor: "#8b0d01",
    borderRadius: 6,
    paddingVertical: 14,
    marginBottom: 16,
    alignItems: 'center',
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
  successContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    padding: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
});

export default ForgotPassword;