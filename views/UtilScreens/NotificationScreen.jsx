import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // ✅ Add this if using Ionicons
import Header from "../../components/Header";
import BottomNav from "../../components/BottomNav";
import SearchBarWithResults from "../../components/SearchBarWithResults";
import { fetchFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../../utils/friendAPI';
import { useFocusEffect } from '@react-navigation/native';

const NotificationScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchFriendRequests();
      setRequests(data);
    } catch (error) {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadRequests();
    }, [])
  );

  const handleAccept = async (userId) => {
    await acceptFriendRequest(userId);
    loadRequests();
  };

  const handleReject = async (userId) => {
    await rejectFriendRequest(userId);
    loadRequests();
  };

  const getInitialAvatar = (name) => {
    const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : '?';
    return (
      <View style={[styles.profileImage, styles.initialAvatar]}>
        <Text style={styles.initialText}>{initial}</Text>
      </View>
    );
  };

  const renderRequest = (item) => {
    const hasProfilePicture = item.profilePicture && typeof item.profilePicture === 'string';
    return (
      <View style={styles.requestItem} key={item.userId}>
        {hasProfilePicture ? (
          <Image
            source={{ uri: item.profilePicture }}
            style={styles.profileImage}
            defaultSource={require('../../assets/default-profile.png')}
          />
        ) : (
          getInitialAvatar(item.name)
        )}
        <View style={styles.requestInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.requestText}>wants to be your friend</Text>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleAccept(item.userId)} style={styles.actionButton}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReject(item.userId)} style={styles.declineButton}>
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <SearchBarWithResults />

      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#a91101" style={{ marginTop: 40 }} />
        ) : requests.length > 0 ? (
          <View>
            {requests.map(renderRequest)}
          </View>
        ) : (
          <View style={styles.noNotificationsContainer}>
            <Ionicons name="notifications-off" size={50} color="#a91101" />
            <Text style={styles.noNotificationsText}>You do not have any notifications</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 80, // To make room for the BottomNav
    backgroundColor: "white",
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  noNotificationsText: {
    fontSize: 18,
    color: "#a91101",
    fontWeight: "600",
    marginTop: 20,
    textAlign: "center",
  },
  requestItem: {
    flexDirection: 'row',
    marginBottom: 25,
    alignItems: 'flex-start',
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
  },
  initialAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#666',
  },
  requestInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  requestText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 15,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderColor: "#a91101",
  },
  acceptText: {
    color: "#a91101",
    fontWeight: '500',
  },
  declineButton: {
    borderWidth: 1,
    borderColor: "#a91101",
    borderRadius: 4,
    backgroundColor: "#a91101",
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  declineText: {
    color: "#fff",
  },
});

export default NotificationScreen;
