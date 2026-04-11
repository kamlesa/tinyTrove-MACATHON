import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { supabase } from './UserAuth'; 

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Toggles between Login and Sign Up

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    // 1. Basic validation
    if (!username || !displayName) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }

    setLoading(true);
    
    // 2. Create the secure user (Email, Password, UUID)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      Alert.alert('Sign Up Error', authError.message);
      setLoading(false);
      return;
    }

    // 3. Link the UUID to your new Profiles table
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, // This is the UUID link!
            username: username.toLowerCase(), 
            display_name: displayName,
            avatar_url: '' // Leave blank for now until you build an image uploader
          }
        ]);

      if (profileError) {
        Alert.alert('Profile Error', profileError.message);
      } else {
        Alert.alert('Success!', 'Welcome to tinyTrove!');
      }
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>tinyTrove</Text>
        <Text style={styles.subtitle}>{isSignUp ? 'Join the community.' : 'Find your next obsession.'}</Text>
      </View>

      <View style={styles.inputContainer}>
        {/* Only show these fields if the user is signing up */}
        {isSignUp && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#000000"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />
            <TextInput
              style={styles.input}
              placeholder="Display Name (e.g., Sanrio Fan)"
              placeholderTextColor="#000000"
              value={displayName}
              onChangeText={setDisplayName}
              editable={!loading}
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#000000"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#000000"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.primaryButton} 
          onPress={isSignUp ? signUpWithEmail : signInWithEmail}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>}
        </Pressable>

        <Pressable 
          style={styles.secondaryButton} 
          onPress={() => setIsSignUp(!isSignUp)} // Toggles the form mode
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>
            {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  headerContainer: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 42, fontWeight: 'bold', color: '#FF8FAB' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
  inputContainer: { gap: 12, marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 16, borderRadius: 8, fontSize: 16 },
  buttonContainer: { gap: 12, color: '#666' },
  primaryButton: { backgroundColor: '#FF8FAB', padding: 16, borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: 'transparent', padding: 16, alignItems: 'center' },
  secondaryButtonText: { color: '#000000', fontSize: 16, fontWeight: 'bold' },
});