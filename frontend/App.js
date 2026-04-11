import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LoginScreen } from './LoginScreen'; // Import your new screen

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LoginScreen />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
});