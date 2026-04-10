import { useState } from 'react';
import { Text, View, Pressable, StatusBar } from 'react-native';

const pages = [
  { key: 'home', label: 'Home' },
  { key: 'map', label: 'Map' },
  { key: 'profile', label: 'Profile' },
  { key: 'post', label: 'Post' },
  { key: 'search', label: 'Search' },
];

const pageTitles = {
  home: 'Home Page',
  map: 'Map Page',
  profile: 'Profile Page',
  post: 'Post Page',
  search: 'Search Page',
};

export default function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.title}>{pageTitles[activePage]}</Text>
      </View>

      <View style={styles.footer}>
        {pages.map((page) => (
          <Pressable
            key={page.key}
            style={[styles.button, activePage === page.key && styles.activeButton]}
            onPress={() => setActivePage(page.key)}
          >
            <Text style={styles.buttonText}>{page.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold'
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderTopWidth: 1
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10
  },

  buttonText: {
    fontWeight: '600',
  },
};
