import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MessagesScreen } from "./views/MessagesScreen";
import { ProfileScreen } from "./views/ProfileScreen";
import MainPage from "./views/CategoryScreens/MainPage";
//category screens
import ArtsNewsScreen from './views/CategoryScreens/ArtsNewsScreen'; // Import your screens
import TechNewsScreen from './views/CategoryScreens/TechNewsScreen';
import FriendsNewsScreen from './views/CategoryScreens/FriendsNewsScreen';

import ScrollableScreen from './views/ScrollableScreen';

import ForYou from './views/ForYou';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ForYou">
        <Stack.Screen 
          name="ForYou" 
          component={ForYou} 
          options={{ headerShown: false }}  // Hide header for MainPage
        />
        <Stack.Screen name="Messages" options={{ headerShown: false }} component={MessagesScreen} />
        <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />

        <Stack.Screen name="Arts" options={{ headerShown: false }} component={ArtsNewsScreen} />
        <Stack.Screen name="Tech" options={{ headerShown: false }} component={TechNewsScreen} />
        <Stack.Screen name="Friends" options={{ headerShown: false }} component={FriendsNewsScreen} />

        <Stack.Screen name="Scrollable" options={{ headerShown: false }} component={ScrollableScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
