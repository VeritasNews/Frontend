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
  ScrollView
} from 'react-native';
import { loginUser, saveAuthToken, saveRefreshToken } from '../../utils/authAPI';

const Login = ({ navigation }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert('Error', 'Please enter both email/username and password');
      return;
    }
  
    try {
      setLoading(true);
      const response = await loginUser(identifier, password); // ✅ correct one and only call
  
      await saveAuthToken(response.access);
      await saveRefreshToken(response.refresh);
  
      navigation.navigate('ForYouPersonalized'); // ✅ this should work if 'ForYou' screen is registered
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCreateAccount = () => {
    navigation.navigate('Register');
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
            <TextInput
              style={styles.input}
              placeholder="Email or Username"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
            />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              
              <TouchableOpacity 
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.loginButtonText}>Login</Text>
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
  input: {
    width: '100%',
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    fontSize: 16,
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
  guestButton: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    borderColor: "#d4d4d4", // Light border for subtle distinction
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, // Add slight shadow for 3D effect
    shadowRadius: 3,
  },
  guestButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
    errorText: {
        color: 'red',
        marginTop: 8,
        textAlign: 'center',
    },  
});

export default Login;
