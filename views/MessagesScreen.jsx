import React from 'react';
import { View, Text } from 'react-native';
import { GLOBAL_STYLES } from '../theme/globalStyles';

export const MessagesScreen = () => {
  return (
    <View style={GLOBAL_STYLES.containerCenter}>
      <Text style={GLOBAL_STYLES.textBase}>Messages Screen</Text>
    </View>
  );
};
