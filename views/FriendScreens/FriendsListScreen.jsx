import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image
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

  const renderItem = ({ item }) => {
    const hasValidProfilePicture = 
      item.profilePicture && 
      typeof item.profilePicture === 'string' && 
      !imageErrors[item.userId];
    
    return (
      <TouchableOpacity 
        style={styles.friendCard}
        onPress={() => navigation.navigate('UserProfile', { user: item })}
      >
        {hasValidProfilePicture ? (
          <Image 
            source={{ uri: item.profilePicture }}
            style={styles.profileImage}
            onError={() => handleImageError(item.userId, item.name)}
            defaultSource={require('../../assets/default-profile.png')}
          />
        ) : (
          getInitialAvatar(item.name)
        )}
        <View style={styles.friendInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
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
        <FlatList
          data={friends}
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
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
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
  list: {
    paddingBottom: 80,
  },
});

export default FriendsListScreen;