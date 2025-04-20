import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  fetchFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from '../../utils/api';
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

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.username}>@{item.userName}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => handleAccept(item.userId)} style={styles.accept}>
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleReject(item.userId)} style={styles.reject}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friend Requests</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#a91101" />
      ) : requests.length === 0 ? (
        <Text style={styles.empty}>No pending requests.</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.userId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  empty: { textAlign: 'center', color: '#999', fontStyle: 'italic', marginTop: 20 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: { fontSize: 16, fontWeight: '600' },
  username: { color: '#666', marginBottom: 8 },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  accept: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  reject: {
    backgroundColor: '#E53935',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: 30,
  },
});

export default FriendRequestsScreen;
