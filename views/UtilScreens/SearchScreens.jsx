import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../../components/BottomNav';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { getAuthToken } from '../../utils/authAPI';
import { getFullImageUrl } from '../../utils/articleAPI';

const BASE_URL = 'http://144.91.84.230:8001/api/';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [userResults, setUserResults] = useState([]);
  const [articleResults, setArticleResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setImageErrors({});
    
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${BASE_URL}search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserResults(response.data.users || []);
      setArticleResults(response.data.articles || []);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // Profile picture handling functions from dev branch
  const handleImageError = (userId, name) => {
    console.log(`Failed to load image for ${name} (${userId})`);
    setImageErrors(prev => ({
      ...prev,
      [userId]: true
    }));
  };

  const getInitialAvatar = (name) => {
    const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : '?';
    return (
      <View style={styles.initialAvatar}>
        <Text style={styles.initialText}>{initial}</Text>
      </View>
    );
  };

  // Enhanced user render function with profile picture handling
  const renderUser = ({ item }) => {
    const hasValidProfilePicture = 
      item.profilePicture && 
      typeof item.profilePicture === 'string' && 
      !imageErrors[item.userId];
    
    return (
      <TouchableOpacity
        style={styles.userItem}
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
        <View style={styles.userInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate('NewsDetail', { articleId: item.id })}
    >
      {item.image ? (
        <Image source={{ uri: getFullImageUrl(item.image) }} style={styles.image} />
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

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users or articles"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#a91101" style={{ marginTop: 20 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.resultsWrapper}>
          {userResults.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Users</Text>
              <FlatList
                data={userResults}
                keyExtractor={(item) => item.userId}
                renderItem={renderUser}
              />
            </View>
          )}

          {articleResults.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Articles</Text>
              <FlatList
                data={articleResults}
                keyExtractor={(item) => item.articleId}
                renderItem={renderArticle}
              />
            </View>
          )}

          {!userResults.length && !articleResults.length && query.trim() !== '' && (
            <Text style={styles.empty}>No results found.</Text>
          )}
        </ScrollView>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    margin: 16,
  },
  resultsWrapper: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  // User item styles with profile picture
  userItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
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
  userInfo: {
    flex: 1,
  },
  name: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  username: { 
    color: '#777',
    marginTop: 2
  },
  // Article styles
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: 100, height: 100 },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  summary: { fontSize: 14, color: '#666', marginTop: 4 },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default SearchScreen;