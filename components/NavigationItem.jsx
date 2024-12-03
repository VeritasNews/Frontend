import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const NavigationItem = ({ icon, label, isActive, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.navigationItem}>
      <Image
        resizeMode="contain"
        source={{ uri: icon }}
        style={styles.navigationIcon}
      />
      <Text style={[styles.labelText, isActive ? styles.activeLabel : null]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navigationItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 12,
  },
  navigationIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  labelText: {
    fontSize: 12,
    color: 'rgba(166, 166, 166, 1)',
  },
  activeLabel: {
    color: '#2E0505',
    fontWeight: 'bold',
  },
});
