import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import Screens
import { MessagesScreen } from "./views/MessagesScreen";
import ProfileScreen from "./views/ProfileScreen";
import MainPage from "./views/CategoryScreens/MainPage";
import SiyasetNewsScreen from './views/CategoryScreens/SiyasetNewsScreen';
import ScrollableScreen from './views/ScrollableScreen';
import ForYou from './views/ForYou';
import EntertainmentNewsScreen from './views/CategoryScreens/EntertainmentNewsScreen';

const Stack = createStackNavigator();
import Login  from './views/AuthScreens/Login';
import Register from './views/AuthScreens/Register';
import ChooseCategoryScreen from './views/CategoryScreens/ChooseCategoryScreen';

export default function App() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Register" screenOptions={{ headerShown: false }}> */}
      <Stack.Navigator initialRouteName="ForYou" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ForYou" component={ForYou} />
        {/* <Stack.Screen name="MainPage" component={MainPage} /> */}
        <Stack.Screen name="Messages" component={MessagesScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Siyaset" component={SiyasetNewsScreen} />
        <Stack.Screen name="Scrollable" component={ScrollableScreen} />
        <Stack.Screen name="Entertainment" component={EntertainmentNewsScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ChooseCategoryScreen" component={ChooseCategoryScreen} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
