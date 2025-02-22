import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NewsScreen } from "./views/NewsScreen";
import { MessagesScreen } from "./views/MessagesScreen";
import { ProfileScreen } from "./views/ProfileScreen";
import OldNewsScreen from "./views/OldNewspaperScreen";
import MainPage from "./views/CategoryScreens/MainPage";
import ScenarioTwo from "./views/ScenarioTwo";
//category screens
import ArtsNewsScreen from './views/CategoryScreens/ArtsNewsScreen'; // Import your screens
import TechNewsScreen from './views/CategoryScreens/TechNewsScreen';
import FriendsNewsScreen from './views/CategoryScreens/FriendsNewsScreen';

import ScrollableScreen from './views/ScrollableScreen';

import ArticlesScreen from './views/ArticlesScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ArticlesScreen">
        <Stack.Screen 
          name="ArticlesScreen" 
          component={ArticlesScreen} 
          options={{ headerShown: false }}  // Hide header for MainPage
        />
        <Stack.Screen name="News" options={{ headerShown: false }} component={NewsScreen} />
        <Stack.Screen name="Messages" options={{ headerShown: false }} component={MessagesScreen} />
        <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />

        <Stack.Screen name="Arts" options={{ headerShown: false }} component={ArtsNewsScreen} />
        <Stack.Screen name="Tech" options={{ headerShown: false }} component={TechNewsScreen} />
        <Stack.Screen name="Friends" options={{ headerShown: false }} component={FriendsNewsScreen} />

        <Stack.Screen name="Scrollable" options={{ headerShown: false }} component={ScrollableScreen} />

        <Stack.Screen name="OldNews" component={OldNewsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
