import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  onImageSelected?: (uri: string) => void;
};

const ImageUploader: React.FC<Props> = ({ onImageSelected }) => {
  const [image, setImage] = useState<string | null>(null);

  const requestPermission = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'We need access to your photos to upload an image.'
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      onImageSelected?.(uri);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>
          {image ? 'Change Image' : 'Upload Image'}
        </Text>
      </Pressable>

      {image && (
        <Image source={{ uri: image }} style={styles.preview} />
      )}
    </View>
  );
};

export default ImageUploader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: '#4F8CFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  preview: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
});