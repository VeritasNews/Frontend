import React, { useState } from 'react';
import {
  View, TextInput, FlatList, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { getAuthToken } from '../utils/authAPI';
import { getFullImageUrl } from '../utils/articleAPI';

const BASE_URL = 'http://localhost:8000/api/';

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

  const renderUser = ({ item }) => {
    const failed = imageErrors[item.userId];
    return (
      <TouchableOpacity
        style={styles.resultItem}
        onPress={() => navigation.navigate('UserProfile', { user: item })}
      >
        {item.profilePicture && !failed ? (
          <Image
            source={{ uri: item.profilePicture }}
            style={styles.avatar}
            onError={() =>
              setImageErrors((prev) => ({ ...prev, [item.userId]: true }))
            }
          />
        ) : (
          <View style={styles.initialAvatar}>
            <Text style={styles.initialText}>{item.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
        )}
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>@{item.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => navigation.navigate('NewsDetail', { articleId: item.id })}
    >
      {item.image ? (
        <Image source={{ uri: getFullImageUrl(item.image) }} style={styles.articleImage} />
      ) : (
        <Ionicons name="image-outline" size={40} color="#aaa" style={styles.articleImage} />
      )}
      <View>
        <Text style={styles.name}>{item.title}</Text>
        <Text style={styles.username}>{item.summary?.slice(0, 60) || 'No summary'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {/* Search Bar + Bell Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <TextInput
            placeholder="Dogecoin to the Moon..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.bell}>
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
    color: '#333',
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
    width: 40, height: 40, borderRadius: 20,
  },
  articleImage: {
    width: 60, height: 60,
  },
  initialAvatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#eee',
    alignItems: 'center', justifyContent: 'center',
  },
  initialText: {
    fontWeight: 'bold', color: '#444',
  },
  name: { fontWeight: '600' },
  username: { color: '#666', fontSize: 12 },
});

export default SearchBarWithResults;
