import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Home from './frontEnd/Home';
import Map from './frontEnd/Map';
import Profile from './frontEnd/Profile';
import Post from './frontEnd/Post';
import Search from './frontEnd/Search';

const pages = [
  { key: 'home', label: 'Home' },
  { key: 'map', label: 'Map' },
  { key: 'profile', label: 'Profile' },
  { key: 'post', label: 'Post' },
  { key: 'search', label: 'Search' },
];

const screens = {
  home: Home,
  map: Map,
  profile: Profile,
  post: Post,
  search: Search,
};

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const ActiveScreen = screens[activePage];

  const appContainer = {
    flex: 1,
    flexDirection: 'column',
  };

  const appContent = {
    flex: 1,
  };

  const appFooter = {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderTopWidth: 1
  };

  const appButton = {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  };

  const appButtonActive = {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,

  };

  const buttonText = {
    fontWeight: '600',
  };

  return (
    <View style={appContainer}>
      <View style={appContent}>
        <ActiveScreen />
      </View>

      <View style={appFooter}>
        {pages.map((page) => (
          <Pressable
            key={page.key}
            style={activePage === page.key ? appButtonActive : appButton}
            onPress={() => setActivePage(page.key)}
          >
            <Text style={buttonText}>{page.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}