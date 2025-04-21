import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {
  fetchFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../../utils/friendAPI';
import { useNavigation } from '@react-navigation/native';
import BottomNav from "../../components/BottomNav";

const FriendRequestsScreen = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchFriendRequests();
      console.log('Friend requests data:', data);
      setRequests(data);
    } catch (error) {
      console.error('Failed to load friend requests:', error);
      Alert.alert('Error', 'Failed to fetch requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (userId) => {
    try {
      await acceptFriendRequest(userId);
      Alert.alert('Accepted', 'You are now friends!');
      loadRequests();
    } catch (error) {
      console.error('Accept error:', error);
      Alert.alert('Error', 'Could not accept request.');
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectFriendRequest(userId);
      Alert.alert('Rejected', 'Request removed.');
      loadRequests();
    } catch (error) {
      console.error('Reject error:', error);
      Alert.alert('Error', 'Could not reject request.');
    }
  };

  const renderItem = ({ item }) => {
    const getInitialAvatar = (name) => {
      const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : '?';
      return (
        <View style={[styles.profileImage, styles.initialAvatar]}>
          <Text style={styles.initialText}>{initial}</Text>
        </View>
      );
    };

    const defaultImage = require('../../assets/default-profile.png');
    
    const hasProfilePicture = item.profilePicture && typeof item.profilePicture === 'string';
    
    return (
      <View style={styles.requestItem}>
        {hasProfilePicture ? (
          <Image 
            source={{ uri: item.profilePicture }}
            style={styles.profileImage}
            defaultSource={defaultImage}
            onError={(e) => {
              console.error('Image loading error:', e.nativeEvent.error);
            }}
          />
        ) : (
          getInitialAvatar(item.name)
        )}
        <View style={styles.requestInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.requestText}>Wants to be your Friend</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleAccept(item.userId)} style={styles.actionButton}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReject(item.userId)} style={styles.declineButton}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.timeText}>5 min ago</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FRIEND REQUESTS</Text>
      <View style={styles.divider} />
      {loading ? (
        <ActivityIndicator size="large" color="#888" />
      ) : requests.length === 0 ? (
        <Text style={styles.empty}>No pending requests.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
    padding: 16 
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333',
    marginTop: 10,
    marginBottom: 8
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 16
  },
  empty: { 
    textAlign: 'center', 
    color: '#999', 
    fontStyle: 'italic', 
    marginTop: 20 
  },
  requestItem: {
    flexDirection: 'row',
    marginBottom: 25,
    position: 'relative',
    alignItems: 'flex-start'
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15
  },
  initialAvatar: {
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#666'
  },
  requestInfo: {
    flex: 1,
    justifyContent: 'center'
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600',
    marginBottom: 4
  },
  requestText: { 
    color: '#888', 
    fontSize: 14,
    marginBottom: 8
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButton: {
    marginRight: 15,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderColor: "rgba(169, 17, 1, 1)"
  },
  acceptText: {
    color: "rgba(169, 17, 1, 1)",
    fontWeight: '500'
  },
  declineButton: {
    borderWidth: 1,
    borderColor: "rgba(240, 241, 250, 1)",
    borderRadius: 4,
    backgroundColor: "rgba(169, 17, 1, 1)",
    paddingVertical: 6,
    paddingHorizontal: 16
  },
  declineText: {
    color: "rgba(240, 241, 250, 1)",
  },
  timeText: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 12,
    color: '#888'
  },
  list: {
    paddingBottom: 30,
  },
});

export default FriendRequestsScreen;