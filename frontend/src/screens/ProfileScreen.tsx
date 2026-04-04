import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storage';

export default function ProfileScreen() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadUsername = async () => {
      const savedUsername = await AsyncStorage.getItem(STORAGE_KEYS.USERNAME);
      if (savedUsername) {
        setUsername(savedUsername);
      }
    };

    loadUsername();
  }, []);

  return (
      <View style={styles.container}>
        <Text style={styles.title}>프로필</Text>
        <Text style={styles.text}>별명: {username}</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090909',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  text: {
    color: '#ccc',
    marginTop: 12,
    fontSize: 16,
  },
});