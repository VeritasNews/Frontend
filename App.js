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

const Stack = createStackNavigator();
import Login  from './views/AuthScreens/Login';
import Register from './views/AuthScreens/Register';
import ChooseCategoryScreen from './views/CategoryScreens/ChooseCategoryScreen';
import SearchScreen from './views/UtilScreens/SearchScreens';

import NewsDetailScreen from "./views/NewsDetailScreen";
import LikedArticlesScreen from "./views/LikedArticlesScreen";

//Friend screens
import UserProfileScreen from './views/FriendScreens/UserProfileScreen';
import FriendRequestsScreen from './views/FriendScreens/FriendRequestsScreen';
import FriendsListScreen from "./views/FriendScreens/FriendsListScreen";
import FriendsNewsScreen from "./views/FriendScreens/FriendsNewsScreen";

// category screens
// import BilimNewsScreen from './views/CategoryScreens/BilimNewsScreen';
import CevreNewsScreen from './views/CategoryScreens/CevreNewsScreen';
import DinNewsScreen from './views/CategoryScreens/DinNewsScreen';
import DunyaHaberleriNewsScreen from './views/CategoryScreens/DunyaHaberleriNewsScreen';
import EgitimNewsScreen from './views/CategoryScreens/EgitimNewsScreen';
import EkonomiNewsScreen from './views/CategoryScreens/EkonomiNewsScreen';
import IliskilerNewsScreen from './views/CategoryScreens/IliskilerNewsScreen';
import KulturNewsScreen from './views/CategoryScreens/KulturNewsScreen';
import MagazinNewsScreen from './views/CategoryScreens/MagazinNewsScreen';
import ModaNewsScreen from './views/CategoryScreens/ModaNewsScreen';
import OtomotivNewsScreen from './views/CategoryScreens/OtomotivNewsScreen';
import OyunNewsScreen from './views/CategoryScreens/OyunNewsScreen';
import RuhSagligiNewsScreen from './views/CategoryScreens/RuhSagligiNewsScreen';
// import SaglikNewsScreen from './views/CategoryScreens/SaglikNewsScreen';
import SanatNewsScreen from './views/CategoryScreens/SanatNewsScreen';
import SeyahatNewsScreen from './views/CategoryScreens/SeyahatNewsScreen';
import SporNewsScreen from './views/CategoryScreens/SporNewsScreen';
import TarihNewsScreen from './views/CategoryScreens/TarihNewsScreen';
import TeknolojiNewsScreen from './views/CategoryScreens/TeknolojiNewsScreen';
import UzayNewsScreen from './views/CategoryScreens/UzayNewsScreen';
import YasamTarziNewsScreen from './views/CategoryScreens/YasamTarziNewsScreen';
import YemekNewsScreen from './views/CategoryScreens/YemekNewsScreen';
import EntertainmentNewsScreen from './views/CategoryScreens/EntertainmentNewsScreen';
import SucNewsScreen from "./views/CategoryScreens/SucNewsScreen";

export default function App() {
  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}> */}
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
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
        <Stack.Screen name="LikedArticles" component={LikedArticlesScreen} />

        <Stack.Screen name="Search" component={SearchScreen} />

        {/* category screens */}
        <Stack.Screen name="Suc" component={SucNewsScreen} />
        {/* <Stack.Screen name="Bilim" component={BilimNewsScreen} /> */}
        <Stack.Screen name="Cevre" component={CevreNewsScreen} />
        <Stack.Screen name="Din" component={DinNewsScreen} />
        <Stack.Screen name="DunyaHaberleri" component={DunyaHaberleriNewsScreen} />
        <Stack.Screen name="Egitim" component={EgitimNewsScreen} />
        <Stack.Screen name="Ekonomi" component={EkonomiNewsScreen} />
        <Stack.Screen name="Iliskiler" component={IliskilerNewsScreen} />
        <Stack.Screen name="Kultur" component={KulturNewsScreen} />
        <Stack.Screen name="Magazin" component={MagazinNewsScreen} />
        <Stack.Screen name="Moda" component={ModaNewsScreen} />
        <Stack.Screen name="Otomotiv" component={OtomotivNewsScreen} />
        <Stack.Screen name="Oyun" component={OyunNewsScreen} />
        <Stack.Screen name="RuhSagligi" component={RuhSagligiNewsScreen} />
        {/* <Stack.Screen name="Saglik" component={SaglikNewsScreen} /> */}
        <Stack.Screen name="Sanat" component={SanatNewsScreen} />
        <Stack.Screen name="Seyahat" component={SeyahatNewsScreen} />
        <Stack.Screen name="Spor" component={SporNewsScreen} />
        <Stack.Screen name="Tarih" component={TarihNewsScreen} />
        <Stack.Screen name="Teknoloji" component={TeknolojiNewsScreen} />
        <Stack.Screen name="Uzay" component={UzayNewsScreen} />
        <Stack.Screen name="YasamTarzi" component={YasamTarziNewsScreen} />
        <Stack.Screen name="Yemek" component={YemekNewsScreen} />

        {/* Friend Screens */}
        <Stack.Screen name="UserProfile" component={UserProfileScreen} />
        <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
        <Stack.Screen name="FriendsList" component={FriendsListScreen} />
        <Stack.Screen name="FriendsNews" component={FriendsNewsScreen} />

        {/* Add other screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
