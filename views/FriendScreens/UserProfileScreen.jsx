import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../../components/BottomNav';
import { sendFriendRequest } from '../../utils/friendAPI';
import { Ionicons } from '@expo/vector-icons';

const UserProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route.params;
  const [requestSent, setRequestSent] = useState(false);

  const handleAddFriend = async () => {
    if (requestSent) return;
  
    try {
      await sendFriendRequest(user.userId);
      setRequestSent(true);
      Alert.alert('Friend Request Sent', `You sent a request to ${user.name}`);
    } catch (error) {
      const msg = error?.response?.data?.error;
  
      if (msg === 'Friend request already sent.') {
        setRequestSent(true);
        Alert.alert('Already Sent', 'You have already sent a request to this user.');
      } else if (msg === "You can't befriend yourself!") {
        Alert.alert("Invalid", "You can't send a friend request to yourself.");
      } else {
        Alert.alert('Error', 'Could not send friend request.');
        console.error("Friend request failed:", error);
      }
    }
  };  

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#333" />
        </TouchableOpacity>

        {/* User Info */}
        <View style={styles.profileBox}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.userName}</Text>

          <TouchableOpacity
            style={[styles.button, requestSent && { backgroundColor: '#ccc' }]}
            onPress={handleAddFriend}
            disabled={requestSent}
          >
            <Text style={styles.buttonText}>
              {requestSent ? 'Request Sent' : 'Add Friend'}
            </Text>
          </TouchableOpacity>

        </View>
      </View>

      <BottomNav navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  profileBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
    color: '#222',
  },
  username: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#a91101',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default UserProfileScreen;
