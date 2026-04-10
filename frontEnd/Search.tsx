import React from 'react';
import { View, Text } from 'react-native';

export default function Search() {
  const page = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const title = {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  };

  return (
    <View style={page}>
      <Text style={title}>Search Page</Text>
    </View>
  );
}