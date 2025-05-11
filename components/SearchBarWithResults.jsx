import React, { useState } from 'react';
import {
  View, TextInput, FlatList, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getAuthToken } from '../utils/authAPI';
import { getFullImageUrl } from '../utils/articleAPI';

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/`;

const SearchBarWithResults = () => {
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

  const getInitialAvatar = (name) => (
    <View style={styles.initialAvatar}>
      <Text style={styles.initialText}>{name?.charAt(0).toUpperCase() || '?'}</Text>
    </View>
  );

  const handleImageError = (userId) => {
    setImageErrors((prev) => ({ ...prev, [userId]: true }));
  };

  const renderUser = ({ item }) => {
    const failed = imageErrors[item.userId];
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => navigation.navigate('Search', { query, type: 'user', user: item })}
      >
        {item.profilePicture && !failed ? (
          <Image
            source={{ uri: item.profilePicture }}
            style={styles.avatar}
            onError={() => handleImageError(item.userId)}
          />
        ) : getInitialAvatar(item.name)}
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate('Search', { query, type: 'article', article: item })}
    >
      {item.image ? (
        <Image source={{ uri: getFullImageUrl(item.image) }} style={styles.articleImage} />
      ) : (
        <View style={[styles.articleImage, styles.imagePlaceholder]}>
          <Ionicons name="image-outline" size={30} color="#aaa" />
        </View>
      )}
      <View style={styles.articleText}>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.username} numberOfLines={2}>
          {item.summary || 'No summary available.'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {/* Search Input + Bell */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Gerçeği bul...."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor="#aaa"
            style={styles.input}
            onFocus={() => navigation.navigate('Search', { query })} // Navigate on focus
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => navigation.navigate('Search', { query })} // Navigate on button press
          >
            <Ionicons name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.bell}             
        onPress={() => navigation.navigate('Notification', { query })} // Navigate on button press
        >
          <Ionicons name="notifications-outline" size={22} color="white" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator size="small" color="#a91101" style={{ marginVertical: 10 }} />
      ) : (
        <>
          {userResults.length > 0 && (
            <FlatList
              data={userResults}
              keyExtractor={(item) => item.userId}
              renderItem={renderUser}
              ListHeaderComponent={<Text style={styles.label}>Users</Text>}
            />
          )}
          {articleResults.length > 0 && (
            <FlatList
              data={articleResults}
              keyExtractor={(item) => item.articleId}
              renderItem={renderArticle}
              ListHeaderComponent={<Text style={styles.label}>Articles</Text>}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: '#fff',
    width: "100%",
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
    color: '#f4f4f4',
  },
  searchButton: {
    padding: 8,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#a91101',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'gold',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
    fontSize: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  initialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    fontWeight: 'bold',
    color: '#444',
  },
  name: { fontWeight: '600' },
  username: { color: '#666', fontSize: 12 },
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 1,
  },
  articleImage: {
    width: 60,
    height: 60,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  imagePlaceholder: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleText: {
    flex: 1,
    padding: 8,
    justifyContent: 'center',
  },
});

export default SearchBarWithResults;
