import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../theme/colors';
import FONTS from '../theme/fonts';

export const CategoryButton = ({ label, isActive }) => {
  return (
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
