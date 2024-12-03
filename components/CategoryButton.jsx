import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CategoryButton = ({ label, isActive }) => {
  return (
    <View style={[styles.categoryButton, isActive ? styles.activeCategory : null]}>
      <Text
        accessible
        accessibilityLabel={`Category: ${label}`}
        style={[styles.categoryText, isActive ? styles.activeCategoryText : null]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    alignSelf: 'stretch',
    borderRadius: 16,
    borderColor: 'rgba(240, 241, 250, 1)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  activeCategory: {
    borderColor: 'rgba(169, 17, 1, 1)',
    backgroundColor: 'rgba(169, 17, 1, 1)',
  },
  categoryText: {
    fontSize: 12,
    color: '#2E0505',
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#FFF',
  },
});
