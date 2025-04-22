import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image
} from 'react-native';
import { searchUsers } from "../../utils/api";
import { useNavigation } from '@react-navigation/native';
import BottomNav from "../../components/BottomNav";

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setImageErrors({});
    
    try {
      const users = await searchUsers(query);
      console.log('Search results:', users);
      setResults(users);
    } catch (error) {
      console.error("Search failed:", error);
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

  const renderUserItem = ({ item }) => {
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

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users by name or username"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      
      {loading ? (
        <ActivityIndicator size="large" color="#a91101" style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.userId}
          renderItem={renderUserItem}
          ListEmptyComponent={
            query.length > 0 && !loading ? (
              <Text style={styles.emptyText}>No users found</Text>
            ) : null
          }
        />
      )}
      
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  userItem: {
    padding: 14,
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
  loader: {
    marginTop: 20
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#777',
    fontStyle: 'italic'
  }
});

export default SearchScreen;