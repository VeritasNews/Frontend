import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  SafeAreaView,
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
    return path.startsWith('http') ? path : `http://144.91.84.230:8001${path.startsWith('/media') ? '' : '/media/'}${path}`;
  };

  const renderArticleItem = (article) => (
    <TouchableOpacity
      key={article.id}
      style={styles.articleCard}
      onPress={() => navigation.navigate('NewsDetail', { articleId: article.id })}
    >
      {article.image ? (
        <Image source={{ uri: article.image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Ionicons name="image-outline" size={40} color="#aaa" />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.summary} numberOfLines={2}>
          {article.summary || 'No summary available.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const containerStyle = Platform.select({
    web: {
      backgroundColor: "white",
      display: "flex",
      height: "100vh",
      width: "100vw",
      position: "relative",
    },
    default: {
      flex: 1,
      backgroundColor: "white",
      position: "relative",
    },
  });

  if (loading || !userData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a91101" />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: "white",
            paddingHorizontal: 4,
            paddingTop: 10,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator
        >
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

          <View style={styles.articlesContainer}>
            {(activeTab === 'liked' ? likedArticles : userData.read_history)?.map(renderArticleItem)}
            {(!activeTab === 'liked' ? likedArticles : userData.read_history)?.length === 0 && (
              <Text style={styles.empty}>No data to show.</Text>
            )}
          </View>
        </ScrollView>

        <BottomNav navigation={navigation} />
      </SafeAreaView>
    </View>
  );  
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    elevation: 2,
  },
  avatar: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    marginBottom: 12 
  },
  name: { 
    fontSize: 20, 
    fontWeight: '600' 
  },
  username: { 
    color: '#666', 
    fontSize: 14 
  },
  inlineButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 12,
  },
  inlineBtn: {
    backgroundColor: '#a91101',
    borderColor: "#8b0d01",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  inlineBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'white',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  stat: { 
    alignItems: 'center' 
  },
  statNumber: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  statLabel: { 
    fontSize: 12, 
    color: '#777' 
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 8,
  },
  tabText: { 
    fontSize: 15, 
    color: '#888', 
    paddingBottom: 4 
  },
  activeTab: { 
    color: '#a91101', 
    fontWeight: 'bold', 
    borderBottomWidth: 2, 
    borderBottomColor: '#a91101' 
  },
  articlesContainer: {
    paddingHorizontal: 16,
  },
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
