import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase'

type Props = {
  folderName: string;
  bucketName: string;
  onUploadComplete?: (url: string) => void;
};

const ImageUploader: React.FC<Props> = ({ folderName, bucketName, onUploadComplete }) => {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const pickAndUploadImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    // console.log('Image URI:', uri);
    setImage(uri);

    try {
      setUploading(true);

      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();

      const filePath = `${folderName}/${Date.now()}.jpg`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      onUploadComplete?.(publicUrl);
    } catch (err) {
      console.error('Upload error:', err);
      Alert.alert(
        'Upload failed',
        'Check your internet connection or Supabase setup.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={pickAndUploadImage}>
        <Text style={styles.buttonText}>
          {uploading
            ? 'Uploading...'
            : image
            ? 'Change Image'
            : 'Upload Image'}
        </Text>
      </Pressable>

      {uploading && <ActivityIndicator />}

      {image && !uploading && (
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