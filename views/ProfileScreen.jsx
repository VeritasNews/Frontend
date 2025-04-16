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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import { getUserProfile, updateProfilePicture } from '../utils/userAPI';
import { getAuthToken } from '../utils/authAPI';
import { fetchFriends } from '../utils/friendAPI';
import fallbackAvatar from '../assets/default_profile.jpg';
import * as ImagePicker from 'react-native-image-picker';

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
        const friendList = await fetchFriends();
        setUserData(data);
        setFriends(friendList);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Could not load profile. Please log in again.');
        navigation.navigate('Login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleProfilePicChange = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };
  
    ImagePicker.launchImageLibrary(options, async (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert("Error", "Could not select image.");
        return;
      }
  
      const imageAsset = response.assets?.[0];
      if (!imageAsset) return;
  
      try {
        await updateProfilePicture(imageAsset);
        const updatedUser = await getUserProfile();
        setUserData(updatedUser);
        Alert.alert("Success", "Profile picture updated!");
      } catch (err) {
        console.error("Upload failed:", err);
        Alert.alert("Error", "Failed to update profile picture.");
      }
    });
  };

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
  const getProfileImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http')
      ? path
      : `http://127.0.0.1:8000${path.startsWith('/media') ? '' : '/media/'}${path}`;
  };
  

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleProfilePicChange}>
        <Image
          source={userData.profilePicture ? { uri: getProfileImageUrl(userData.profilePicture) } : fallbackAvatar}
          style={styles.avatar}
        />

        </TouchableOpacity>
        <Text style={styles.name}>{userData.name || 'Unknown User'}</Text>
        <Text style={styles.username}>@{userData.userName || 'unknown'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('FriendsList')} style={styles.stat}>
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
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FriendRequests')}>
          <Text>Friend Requests</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.bio}>{userData.bio || 'No bio provided.'}</Text>

      <View style={styles.tabRow}>
        <TouchableOpacity onPress={() => setActiveTab('posts')}>
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTab]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LikedArticles')}>
          <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTab]}>Liked</Text>
        </TouchableOpacity>
      </View>


      {activeTab === 'posts' ? (
        <FlatList
          data={userData.posts || []}
          renderItem={renderPost}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.postGrid}
          ListEmptyComponent={<Text style={styles.emptyText}>No posts yet.</Text>}
        />
      ) : (
        <FlatList
          data={userData.liked_articles || []}
          renderItem={renderLikedArticle}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.likedList}
          ListEmptyComponent={<Text style={styles.emptyText}>No liked articles yet.</Text>}
        />
      )}

      <BottomNav navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  username: {
    color: '#888',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: '700',
    fontSize: 18,
    color: '#333',
  },
  statLabel: {
    color: '#777',
    fontSize: 12,
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    elevation: 1,
  },
  bio: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 30,
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    paddingBottom: 4,
  },
  activeTab: {
    color: '#a91101',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#a91101',
  },
  postGrid: {
    paddingHorizontal: 10,
    paddingBottom: 60,
  },
  postItem: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderPost: {
    flex: 1,
    backgroundColor: '#eaeaea',
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
    padding: 14,
    backgroundColor: '#fff',
    marginVertical: 6,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  likedTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontStyle: 'italic',
  },
});


export default ProfileScreen;