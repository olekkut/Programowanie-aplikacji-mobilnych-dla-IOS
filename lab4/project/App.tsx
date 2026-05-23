import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, FlatList, ActivityIndicator, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Location from 'expo-location';

type Post = { id: number; title: string; body: string };

export default function App() {
  const [deviceInfo, setDeviceInfo] = useState<{ manufacturer: string; modelName: string; osName: string }>({ manufacturer: '', modelName: '', osName: Platform.OS });
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<{ latitude?: number; longitude?: number }>({});

  useEffect(() => {
    (async () => {
      try {
        if (Device.isDevice) {
          setDeviceInfo({
            manufacturer: Device.manufacturer ?? '',
            modelName: Device.modelName ?? '',
            osName: Device.osName ?? Platform.OS,
          });
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const fetchPosts = () => {
    setLoading(true);
    return fetch('https://jsonplaceholder.typicode.com/posts?_limit=8')
      .then((r) => r.json())
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const pos = await Location.getCurrentPositionAsync({});
        setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lab 4 — Zasoby sprzętowe i publiczne API</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informacje o urządzeniu</Text>
        <Text>Platforma: {Platform.OS}</Text>
        <Text>Manufacturer: {deviceInfo.manufacturer || '—'}</Text>
        <Text>Model: {deviceInfo.modelName || '—'}</Text>
        <Text>OS: {deviceInfo.osName || '—'}</Text>
        <Text>Latitude: {location.latitude ?? '—'}</Text>
        <Text>Longitude: {location.longitude ?? '—'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dane z publicznego API</Text>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item: Post) => String(item.id)}
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await fetchPosts();
              await requestLocation();
              setRefreshing(false);
            }}
            renderItem={({ item }: { item: Post }) => (
              <View style={styles.post}>
                <Text style={styles.postTitle}>{item.title}</Text>
                <Text numberOfLines={2}>{item.body}</Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  card: { marginBottom: 16, padding: 12, borderRadius: 8, backgroundColor: '#f6f6f6' },
  cardTitle: { fontWeight: '600', marginBottom: 8 },
  post: { marginBottom: 10 },
  postTitle: { fontWeight: '700' },
});
