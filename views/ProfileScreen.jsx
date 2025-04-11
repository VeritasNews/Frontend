import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from "../components/BottomNav";
import { getUserProfile, getAuthToken } from '../utils/api'; // Use the helper function

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getAuthToken();
        if (!token) {
          navigation.navigate('Login');
          return;
        }

        const data = await getUserProfile();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        Alert.alert("Error", "Could not load profile. Please log in again.");
        navigation.navigate('Login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const mockPosts = [
    { id: '1', views: '2.4M' },
    { id: '2', views: '16.8M' },
    { id: '3', views: '14.2M' },
    { id: '4', views: '3.8M' },
    { id: '5', views: '2.8M' },
    { id: '6', views: '582.9K' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.postItem}>
      <View style={styles.placeholderPost} />
      <Text style={styles.viewText}>▶ {item.views}</Text>
    </View>
  );

  if (loading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a91101" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: userData.avatar_url || 'https://via.placeholder.com/80' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{userData.name || 'Unknown User'}</Text>
        <Text style={styles.username}>@{userData.username || 'unknown'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{userData.following ?? 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{userData.followers ?? 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{userData.likes ?? 0}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}><Text>Edit Profile</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button}><Text>Add Friends</Text></TouchableOpacity>
      </View>

      <Text style={styles.bio}>{userData.bio || "No bio provided."}</Text>

      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setActiveTab('posts')}>
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTab]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LikedArticles')}>
          <Text style={styles.tabText}>Liked</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.postGrid}
      />
      <BottomNav navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileHeader: { alignItems: 'center', marginTop: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold' },
  username: { color: '#666' },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  stat: { alignItems: 'center' },
  statNumber: { fontWeight: 'bold', fontSize: 16 },
  statLabel: { color: '#888' },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  bio: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 20,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 20,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTab: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  postGrid: {
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  postItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 5,
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-end',
    padding: 5,
  },
  placeholderPost: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  viewText: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});

export default ProfileScreen;
