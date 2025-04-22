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
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'react-native-image-picker';
import BottomNav from '../components/BottomNav';
import { getUserProfile, updateProfilePicture } from '../utils/userAPI';
import { getAuthToken } from '../utils/authAPI';
import { fetchFriends } from '../utils/friendAPI';
import { getLikedArticles } from '../utils/articleAPI';
import fallbackAvatar from '../assets/default_profile.jpg';

const ProfileScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('liked');
  const [userData, setUserData] = useState(null);
  const [friends, setFriends] = useState([]);
  const [likedArticles, setLikedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getAuthToken();
        if (!token) return navigation.navigate('Login');

        const [data, friendList, liked] = await Promise.all([
          getUserProfile(),
          fetchFriends(),
          getLikedArticles(),
        ]);
        setUserData(data);
        setFriends(friendList);
        setLikedArticles(liked);
      } catch (error) {
        console.error('Error fetching user:', error);
        Alert.alert('Error', 'Could not load profile.');
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

  const getProfileImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://139.179.221.240:8000${path.startsWith('/media') ? '' : '/media/'}${path}`;
  };

  const renderArticleItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate('NewsDetailScreen', { articleId: item.articleId })}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="image-outline" size={40} color="#aaa" />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary || 'No summary available.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a91101" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <FlatList
        ListHeaderComponent={
          <>
            <View style={styles.profileCard}>
              <TouchableOpacity onPress={handleProfilePicChange}>
                <Image
                  source={userData.profilePicture ? { uri: getProfileImageUrl(userData.profilePicture) } : fallbackAvatar}
                  style={styles.avatar}
                />
              </TouchableOpacity>
              <Text style={styles.name}>{userData.name || 'Unnamed'}</Text>
              <Text style={styles.username}>@{userData.userName || 'unknown'}</Text>
  
              <View style={styles.inlineButtons}>
                <TouchableOpacity style={styles.inlineBtn} onPress={() => navigation.navigate('FriendRequests')}>
                  <Text style={styles.inlineBtnText}>Friend Requests</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.inlineBtn} onPress={() => navigation.navigate('Settings')}>
                  <Text style={styles.inlineBtnText}>⚙️ Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
  
            <View style={styles.statsRow}>
              <TouchableOpacity style={styles.stat} onPress={() => setActiveTab('liked')}>
                <Text style={styles.statNumber}>{likedArticles.length}</Text>
                <Text style={styles.statLabel}>Liked</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stat} onPress={() => setActiveTab('history')}>
                <Text style={styles.statNumber}>{userData.read_history?.length || 0}</Text>
                <Text style={styles.statLabel}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.stat} onPress={() => navigation.navigate('FriendsList')}>
                <Text style={styles.statNumber}>{friends.length}</Text>
                <Text style={styles.statLabel}>Friends</Text>
              </TouchableOpacity>
            </View>

  
            <View style={styles.tabs}>
              <TouchableOpacity onPress={() => setActiveTab('liked')}>
                <Text style={[styles.tabText, activeTab === 'liked' && styles.activeTab]}>LIKED</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab('history')}>
                <Text style={[styles.tabText, activeTab === 'history' && styles.activeTab]}>HISTORY</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        data={activeTab === 'liked' ? likedArticles : userData.read_history}
        renderItem={renderArticleItem}
        keyExtractor={(item) => item.articleId?.toString() || item.id?.toString()}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<Text style={styles.empty}>No data to show.</Text>}
      />
  
      {/* Fixed BottomNav */}
      <BottomNav navigation={navigation} />
    </View>
  );  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  profileCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  avatar: { width: 110, height: 110, borderRadius: 55, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '600' },
  username: { color: '#666', fontSize: 14 },

  inlineButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12,
  },
  inlineBtn: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  inlineBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#777' },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 8,
  },
  tabText: { fontSize: 15, color: '#888', paddingBottom: 4 },
  activeTab: { color: '#a91101', fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#a91101' },

  contentContainer: { paddingHorizontal: 16, paddingBottom: 80 },

  articleCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  content: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  summary: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  empty: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#999",
    fontStyle: "italic",
  },
});

export default ProfileScreen;
