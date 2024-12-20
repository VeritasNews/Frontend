import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { GLOBAL_STYLES } from "../theme/globalStyles";
import COLORS from "../theme/colors";
import FONTS from "../theme/fonts";

export const NavigationItem = ({ icon, label, isActive, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.navigationItem}>
      <Image
        resizeMode="contain"
        source={{ uri: icon }}
        style={[styles.navigationIcon, isActive && styles.activeIcon]}
      />
      <Text style={[styles.labelText, isActive && styles.activeLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navigationItem: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
  },
  navigationIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: COLORS.textLight, // Default icon color
  },
  activeIcon: {
    tintColor: COLORS.primary, // Active icon color
  },
  labelText: {
    fontSize: FONTS.sizes.medium,
    color: COLORS.textLight,
    fontFamily: FONTS.families.primary,
  },
  activeLabel: {
    color: COLORS.primary, // Highlighted active label color
    fontWeight: FONTS.weights.bold,
  },
});
