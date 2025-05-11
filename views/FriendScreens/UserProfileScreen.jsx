import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import BottomNav from '../../components/BottomNav';
import { sendFriendRequest, fetchFriends } from '../../utils/friendAPI';
import { Ionicons } from '@expo/vector-icons';
import { getAuthToken } from '../../utils/authAPI';
import axios from 'axios';
import fallbackAvatar from '../../assets/default_profile.jpg';

const BASE_URL = 'http://144.91.84.230:8001/api/';

const UserProfileScreen = ({ route, navigation }) => {
  const { user } = route.params || {};
  
  const [userData, setUserData] = useState(user || null);
  const [requestSent, setRequestSent] = useState(false);
  const [friendStatus, setFriendStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('liked');
  const [likedArticles, setLikedArticles] = useState([]);
  const [readHistory, setReadHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState([]);
  
  const formatProfilePictureUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  
  useEffect(() => {
    if (!user || !user.userId) {
      setLoading(false);
      Alert.alert('Error', 'Invalid user data');
      navigation.goBack();
      return;
    }
    
    const fetchFullUserProfile = async () => {
      try {
        const token = await getAuthToken();
        if (!token) {
          navigation.navigate('Login');
          return;
        }
        
        const friendsList = await fetchFriends();
        setFriends(friendsList);
        
        const meResponse = await axios.get(`${BASE_URL}users/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const isSelf = meResponse.data.userId === user.userId;
        
        const isFriend = friendsList.some(friend => 
          friend.userId === user.userId || friend.id === user.userId
        );
        
        if (isSelf) {
          setFriendStatus('self');
        } else if (isFriend) {
          setFriendStatus('friends');
        } else {
          setFriendStatus('not_friends');
        }
        
        if (isSelf) {
          setUserData(meResponse.data);
          
          if (meResponse.data.likedArticles) {
            setLikedArticles(meResponse.data.likedArticles || []);
          }
          
          if (meResponse.data.readingHistory) {
            setReadHistory(meResponse.data.readingHistory || []);
          }
        } else {
          try {
            const response = await axios.get(`${BASE_URL}users/${user.userId}/`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            setUserData(prevData => ({
              ...prevData,
              ...response.data
            }));
            
            if (response.data.likedArticles) {
              setLikedArticles(response.data.likedArticles || []);
            }
            
            if (response.data.readingHistory) {
              setReadHistory(response.data.readingHistory || []);
            }
          } catch (error) {
            console.log('Error fetching full profile:', error.response?.data || error.message);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFullUserProfile();
  }, [user, navigation]);
  
  const handleAddFriend = async () => {
    if (requestSent) return;
  
    try {
      await sendFriendRequest(user.userId);
      setRequestSent(true);
      setFriendStatus('pending');
      Alert.alert('Friend Request Sent', `You sent a request to ${userData.name || userData.userName}`);
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
  
  if (loading || friendStatus === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a91101" />
      </View>
    );
  }
  
  if (!userData) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={26} color="#333" />
          </TouchableOpacity>
          <View style={styles.privateProfile}>
            <Ionicons name="alert-circle-outline" size={50} color="#888" />
            <Text style={styles.privateText}>User Not Found</Text>
            <Text style={styles.privateSubtext}>The requested user could not be found</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const canViewProfile = 
    !userData.privacySettings || // No privacy settings means public
    (userData.privacySettings?.profile_info === 'public') || // Use profile_info instead of profileVisibility
    friendStatus === 'friends' ||
    friendStatus === 'self';

  const canViewLikedArticles = 
    friendStatus === 'self' || 
    friendStatus === 'friends' || 
    (userData.privacySettings && userData.privacySettings.liked_articles === 'public');

  const canViewReadHistory = 
    friendStatus === 'self' || 
    friendStatus === 'friends' || 
    (userData.privacySettings && userData.privacySettings.reading_history === 'public');

  const canViewFriends = 
    friendStatus === 'self' || 
    friendStatus === 'friends' || 
    (userData.privacySettings && userData.privacySettings.friends_list === 'public');

  return (
    <View style={containerStyle}>
      <SafeAreaView style={styles.safeArea}>
        {!canViewProfile ? (
          <View>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={26} color="#333" />
            </TouchableOpacity>
            <View style={styles.privateProfile}>
              <Ionicons name="lock-closed" size={50} color="#888" />
              <Text style={styles.privateText}>This profile is private</Text>
              <Text style={styles.privateSubtext}>Only friends can view this profile</Text>
              
              {!requestSent && friendStatus !== 'self' && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleAddFriend}
                >
                  <Text style={styles.buttonText}>Add Friend</Text>
                </TouchableOpacity>
              )}
              
              {requestSent && friendStatus === 'pending' && (
                <Text style={styles.requestSentText}>Friend request sent</Text>
              )}
            </View>
          </View>
        ) : (
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
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={26} color="#333" />
            </TouchableOpacity>
            
            <View style={styles.profileCard}>
              <Image
                source={userData.profilePicture ? 
                  { uri: formatProfilePictureUrl(userData.profilePicture) } : 
                  fallbackAvatar}
                style={styles.avatar}
              />
              <Text style={styles.name}>{userData.name || userData.userName}</Text>
              <Text style={styles.username}>@{userData.userName}</Text>
              
              {friendStatus !== 'friends' && friendStatus !== 'self' && (
                <View style={styles.inlineButtons}>
                  <TouchableOpacity
                    style={[styles.inlineBtn, requestSent && { backgroundColor: '#ccc' }]}
                    onPress={handleAddFriend}
                    disabled={requestSent}
                  >
                    <Text style={styles.inlineBtnText}>
                      {requestSent ? 'Request Sent' : 'Add Friend'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.statsRow}>
              <TouchableOpacity 
                style={styles.stat}
                onPress={() => canViewLikedArticles && setActiveTab('liked')}
                disabled={!canViewLikedArticles}
              >
                <Text style={[styles.statNumber, !canViewLikedArticles && { color: '#ccc' }]}>
                  {canViewLikedArticles ? (likedArticles?.length || 0) : '-'}
                </Text>
                <Text style={[styles.statLabel, !canViewLikedArticles && { color: '#ccc' }]}>
                  Liked
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.stat}
                onPress={() => canViewReadHistory && setActiveTab('history')}
                disabled={!canViewReadHistory}
              >
                <Text style={[styles.statNumber, !canViewReadHistory && { color: '#ccc' }]}>
                  {canViewReadHistory ? (readHistory?.length || 0) : '-'}
                </Text>
                <Text style={[styles.statLabel, !canViewReadHistory && { color: '#ccc' }]}>
                  History
                </Text>
              </TouchableOpacity>
              
              <View style={styles.stat}>
                <Text style={[styles.statNumber, !canViewFriends && { color: '#ccc' }]}>
                  {canViewFriends ? (userData.friends?.length || 0) : '-'}
                </Text>
                <Text style={[styles.statLabel, !canViewFriends && { color: '#ccc' }]}>
                  Friends
                </Text>
              </View>
            </View>

            {(canViewLikedArticles || canViewReadHistory) && (
              <View style={styles.tabs}>
                <TouchableOpacity onPress={() => canViewLikedArticles && setActiveTab('liked')}>
                  <Text style={[
                    styles.tabText, 
                    activeTab === 'liked' && canViewLikedArticles && styles.activeTab,
                    !canViewLikedArticles && { color: '#ccc' }
                  ]}>
                    LIKED
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => canViewReadHistory && setActiveTab('history')}>
                  <Text style={[
                    styles.tabText, 
                    activeTab === 'history' && canViewReadHistory && styles.activeTab,
                    !canViewReadHistory && { color: '#ccc' }
                  ]}>
                    HISTORY
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.articlesContainer}>
              {(activeTab === 'liked' && canViewLikedArticles ? likedArticles : 
                activeTab === 'history' && canViewReadHistory ? readHistory : []
              )?.map(renderArticleItem)}
              
              {((!canViewLikedArticles && !canViewReadHistory) || 
                (activeTab === 'liked' && !canViewLikedArticles) ||
                (activeTab === 'history' && !canViewReadHistory) ||
                (activeTab === 'liked' && canViewLikedArticles && likedArticles.length === 0) ||
                (activeTab === 'history' && canViewReadHistory && readHistory.length === 0)) && (
                <Text style={styles.empty}>
                  {(!canViewLikedArticles && !canViewReadHistory) || 
                   (activeTab === 'liked' && !canViewLikedArticles) ||
                   (activeTab === 'history' && !canViewReadHistory)
                    ? "This content is private"
                    : "No articles to show"}
                </Text>
              )}
            </View>
          </ScrollView>
        )}

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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
  profileCard: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 60,
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
    fontSize: 14,
    marginBottom: 10
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
    alignItems: 'center',
    minWidth: 70 
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
  privateProfile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 80,
  },
  privateText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  privateSubtext: {
    fontSize: 16,
    color: '#777',
    marginTop: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#a91101',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  requestSentText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default UserProfileScreen;