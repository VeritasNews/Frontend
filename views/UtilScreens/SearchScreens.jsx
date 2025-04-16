import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { searchUsers } from "../../utils/userAPI"; // Assuming you have a function to search users
import { useNavigation } from '@react-navigation/native';
import BottomNav from "../../components/BottomNav";

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSearch = async () => {
    setLoading(true);
    try {
      const users = await searchUsers(query);
      setResults(users);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search users by name or username"
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#a91101" />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.userItem}
              onPress={() => navigation.navigate('UserProfile', { user: item })}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.username}>@{item.userName}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10
  },
  userItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  name: { fontSize: 16, fontWeight: '600' },
  username: { color: '#777' },
});

export default SearchScreen;
