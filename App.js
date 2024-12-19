import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { NewsScreen } from "./views/NewsScreen";
import { MessagesScreen } from "./views/MessagesScreen";
import { ProfileScreen } from "./views/ProfileScreen";
import OldNewsScreen from "./views/OldNewspaperScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OldNews">
        <Stack.Screen name="OldNews" component={OldNewsScreen} />
        <Stack.Screen name="News" component={NewsScreen} />
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
