import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Platform
} from 'react-native';
import { fetchFriends } from '../../utils/friendAPI';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../../components/BottomNav';
import { Ionicons } from '@expo/vector-icons';

const FriendsListScreen = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await fetchFriends();
        console.log('Friends data:', data);
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };
    loadFriends();
  }, []);

  const handleImageError = (userId, name) => {
    console.log(`Failed to load image for ${name} (${userId})`);
    setImageErrors(prev => ({
      ...prev,
      [userId]: true
    }));
  };

  // Create an initial avatar based on name
  const getInitialAvatar = (name) => {
    const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : '?';
    return (
      <View style={styles.initialAvatar}>
        <Text style={styles.initialText}>{initial}</Text>
      </View>
    );
  };

  const renderFriend = (friend) => {
    const hasValidProfilePicture = 
      friend.profilePicture && 
      typeof friend.profilePicture === 'string' && 
      !imageErrors[friend.userId];
    
    return (
      <TouchableOpacity 
        key={friend.userId}
        style={styles.friendCard}
        onPress={() => navigation.navigate('UserProfile', { user: friend })}
      >
        {hasValidProfilePicture ? (
          <Image 
            source={{ uri: friend.profilePicture }}
            style={styles.profileImage}
            onError={() => handleImageError(friend.userId, friend.name)}
            defaultSource={require('../../assets/default-profile.png')}
          />
        ) : (
          getInitialAvatar(friend.name)
        )}
        <View style={styles.friendInfo}>
          <Text style={styles.name}>{friend.name}</Text>
          <Text style={styles.username}>@{friend.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

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

  return (
    <View style={containerStyle}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Friends</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#a91101" style={{ marginTop: 30 }} />
        ) : friends.length === 0 ? (
          <Text style={styles.emptyText}>You have no friends yet.</Text>
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
            {friends.map(renderFriend)}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  friendCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16
  },
  initialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  initialText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666'
  },
  friendInfo: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    fontSize: 14,
    color: '#666',
    marginTop: 2
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontStyle: 'italic',
  },
});

export default FriendsListScreen;