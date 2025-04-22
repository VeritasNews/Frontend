import React, { useState, useEffect } from 'react';
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
import { resetPassword } from '../../utils/authAPI';

const ResetPassword = ({ navigation, route }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Get the token and uid from the route params
  // These should be passed when navigating to this screen from the deep link
  const { token, uid } = route.params || {};
  
  useEffect(() => {
    // Validate that we have the required parameters
    if (!token || !uid) {
      Alert.alert(
        'Invalid Link', 
        'The password reset link is invalid or has expired. Please request a new password reset.',
        [{ text: 'Back to Login', onPress: () => navigation.navigate('Login') }]
      );
    }
  }, [token, uid, navigation]);

  const handleResetPassword = async () => {
    // Clear any previous errors
    setError('');
    
    // Validate password
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      await resetPassword(uid, token, newPassword);
      setSuccess(true);
    } catch (error) {
      setError(
        error.message || 
        'Failed to reset password. The link may have expired. Please request a new password reset.'
      );
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
            <Text style={styles.successTitle}>Password Reset Complete</Text>
            <Text style={styles.successText}>
              Your password has been successfully reset. You can now log in with your new password.
            </Text>
            
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
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
              Reset Password
            </Text>
            
            <Text style={styles.taglineText}>
              Enter your new password below
            </Text>
            
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              
              <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Reset Password</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.createAccountButton}
                onPress={handleBackToLogin}
                disabled={loading}
              >
                <Text style={styles.createAccountButtonText}>Cancel</Text>
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
});

export default ResetPassword;