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

  // ALWAYS show a back button for emergency navigation
  const BackButton = () => (
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => navigation.navigate('Login')}
    >
      <Text style={styles.backButtonText}>← Back to Login</Text>
    </TouchableOpacity>
  );

  const handleResetRequest = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
  
    try {
      setLoading(true);
      setError('');
      await requestPasswordReset(email);
      
      // Important: Set success state to true
      setSuccess(true);
      
      // Show alert as additional confirmation
      Alert.alert(
        'Email Sent',
        `We've sent password reset instructions to ${email}. Please check your inbox.`,
        [
          { text: 'OK' }
        ]
      );
    } catch (error) {
      setError(error.message || 'Failed to send password reset request. Please try again.');
      Alert.alert(
        'Error',
        error.message || 'Failed to send password reset request. Please try again.',
        [
          { text: 'OK' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // Success screen with back navigation
  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton />
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
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginButtonText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Form screen with back navigation
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      
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
                onPress={() => navigation.navigate('Login')}
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
    backgroundColor: "#a91101", // Red background for active category
    borderColor: "#8b0d01", // Darker red border for contrast
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
    borderColor: "#8b0d01", // Darker red border for contrast
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 999,
  },
  backButtonText: {
    fontSize: 16,
    color: '#a91101',
    fontWeight: 'bold',
  },
});

export default ForgotPassword;