import React, { useState, useEffect } from 'react';
import {
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  SafeAreaView,
  Platform
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

  const handleSearch = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!query.trim()) return;
    
    setLoading(true);
    setImageErrors({});
    
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${BASE_URL}search?q=${encodeURIComponent(query)}`, {
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

  const renderUser = (user) => {
    const hasValidProfilePicture = 
      user.profilePicture && 
      typeof user.profilePicture === 'string' && 
      !imageErrors[user.userId];
    
    return (
      <TouchableOpacity
        key={user.userId}
        style={styles.userItem}
        onPress={() => navigation.navigate('UserProfile', { user })}
      >
        {hasValidProfilePicture ? (
          <Image 
            source={{ uri: user.profilePicture }}
            style={styles.profileImage}
            onError={() => handleImageError(user.userId, user.name)}
            defaultSource={require('../../assets/default-profile.png')}
          />
        ) : (
          getInitialAvatar(user.name)
        )}
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>@{user.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderArticle = (article) => (
    <TouchableOpacity
      key={article.id}
      style={styles.articleCard}
      onPress={() => navigation.navigate('NewsDetail', { articleId: article.id })}
    >
      {article.image ? (
        <Image source={{ uri: getFullImageUrl(article.image) }} style={styles.image} />
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

  return (
    <View style={containerStyle}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search users or articles"
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            blurOnSubmit={false}
          />
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#a91101" />
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
            {userResults.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Users</Text>
                {userResults.map(renderUser)}
              </View>
            )}

            {articleResults.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Articles</Text>
                {articleResults.map(renderArticle)}
              </View>
            )}

            {!userResults.length && !articleResults.length && query.trim() !== '' && (
              <View style={styles.emptyContainer}>
                <Text style={styles.empty}>No results found.</Text>
              </View>
            )}
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  userItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  initialAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  initialText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  username: {
    color: '#777',
    marginTop: 2,
  },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  summary: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  empty: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
});

export default SearchScreen;