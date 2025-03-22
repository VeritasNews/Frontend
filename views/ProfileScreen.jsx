import React from 'react';
import { View, Text } from 'react-native';
import { GLOBAL_STYLES } from '../theme/globalStyles';

export const ProfileScreen = () => {
  return (
    <View style={GLOBAL_STYLES.containerCenter}>
      <Text style={GLOBAL_STYLES.textBase}>Profile Screen</Text>
    </View>
  );
};

export default ProfileScreen;