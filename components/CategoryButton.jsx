import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../theme/colors';
import FONTS from '../theme/fonts';

export const CategoryButton = ({ label, isActive, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityHint={`Tap to view ${label} content`}
    >
      <View
        style={[
          styles.categoryButton,
          isActive ? styles.activeCategory : null,
        ]}
      >
        <Text
          accessible
          accessibilityLabel={`Category: ${label}`}
          style={[
            styles.categoryText,
            isActive ? styles.activeCategoryText : null,
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    alignSelf: 'stretch',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    gap: 8,
  },
  activeCategory: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONTS.sizes.medium,
    color: COLORS.textDefault,
    fontWeight: FONTS.weights.semiBold,
    fontFamily: FONTS.families.primary,
  },
  activeCategoryText: {
    color: COLORS.white,
  },
});