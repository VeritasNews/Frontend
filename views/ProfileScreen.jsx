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
import { getUserProfile, getAuthToken, fetchFriends } from '../utils/api';
import fallbackAvatar from '../assets/default_profile.jpg';

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [userData, setUserData] = useState(null);
  const [friends, setFriends] = useState([]);
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
        const friendList = await fetchFriends(); // ✅ Fetch actual friends
        
        setUserData(data);
        setFriends(friendList); // ✅ Store in state
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
  
  const renderPost = ({ item }) => (
    <View style={styles.postItem}>
      <View style={styles.placeholderPost} />
      <Text style={styles.viewText}>▶ {item.views}</Text>
    </View>
  );

  const renderLikedArticle = ({ item }) => (
    <View style={styles.likedItem}>
      <Text style={styles.likedTitle}>❤️ {item.title}</Text>
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
        source={userData.avatar_url ? { uri: userData.avatar_url } : fallbackAvatar}
        style={styles.avatar}
      />
        <Text style={styles.name}>{userData.name || 'Unknown User'}</Text>
        <Text style={styles.username}>@{userData.userName || 'unknown'}</Text>
      </View>

      <View style={styles.statsContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('FriendsList')}>
        <Text style={styles.statNumber}>{friends.length}</Text>
        <Text style={styles.statLabel}>Friends</Text>
      </TouchableOpacity>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{userData.likes ?? 0}</Text>
          <Text style={styles.statLabel}>Likes</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}><Text>Edit Profile</Text></TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FriendRequests")}
        >
          <Text>Friend Requests</Text>
        </TouchableOpacity>
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

      {activeTab === 'posts' ? (
        <FlatList
          data={userData.posts || []}
          renderItem={renderPost}
          keyExtractor={item => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.postGrid}
          ListEmptyComponent={<Text style={styles.emptyText}>No posts yet.</Text>}
        />
      ) : (
        <FlatList
          data={userData.liked_articles || []}
          renderItem={renderLikedArticle}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.likedList}
          ListEmptyComponent={<Text style={styles.emptyText}>No liked articles yet.</Text>}
        />
      )}

      <BottomNav navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileHeader: { alignItems: 'center', marginTop: 20 },
  avatar: { width: 100, height: 100, borderRadius: 40, marginBottom: 7 },
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
  likedList: {
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  likedItem: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginVertical: 6,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  likedTitle: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default ProfileScreen;
