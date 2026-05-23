import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, FlatList, StyleSheet, ActivityIndicator, Pressable, TextInput, Button, KeyboardAvoidingView, Platform, ScrollView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PostCard from './components/PostCard';

type Post = { id: number; title: string; body: string };

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setError(null);
      const cached = await AsyncStorage.getItem('posts-json');
      if (cached) {
        setPosts(JSON.parse(cached));
        setLoading(false);
      }

      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20');
      if (!res.ok) {
        throw new Error(`Błąd pobierania danych: ${res.status}`);
      }
      const data: Post[] = await res.json();
      setPosts(data);
      await AsyncStorage.setItem('posts-json', JSON.stringify(data));
    } catch (e: any) {
      console.warn('Fetch or storage error', e);
      setError(`Nie udało się pobrać danych z serwera: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  function clearCache() {
    AsyncStorage.removeItem('posts-json').then(() => loadData());
  }

  async function addPost() {
    if (!title.trim() || !body.trim() || !userId.trim()) {
      Alert.alert('Błąd', 'Podaj tytuł, treść i User ID');
      return;
    }

    const numericUserId = parseInt(userId.trim(), 10);
    if (isNaN(numericUserId)) {
      Alert.alert('Błąd', 'User ID musi być liczbą');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          userId: numericUserId,
        }),
      });

      if (!res.ok) {
        throw new Error(`Błąd serwera: ${res.status}`);
      }

      const responseData = await res.json();

      Alert.alert(
        'Sukces (Zapisano na serwerze)',
        `Odpowiedź serwera (status ${res.status}):\n${JSON.stringify(responseData, null, 2)}`
      );

      // Dodajemy na początek listy lokalnej (dla symulacji)
      const newPost: Post = {
        id: responseData.id || Date.now(),
        title: title.trim(),
        body: body.trim()
      };
      
      const updated = [newPost, ...posts];
      setPosts(updated);
      await AsyncStorage.setItem('posts-json', JSON.stringify(updated));

      setTitle('');
      setBody('');
      setUserId('');
    } catch (e: any) {
      setError(`Błąd dodawania wpisu: ${e.message}`);
      Alert.alert('Błąd wysyłania', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lab3 — JSON & Sieć</Text>
        <Pressable onPress={clearCache} style={styles.reload}>
          <Text style={styles.reloadText}>Odśwież (usuń cache)</Text>
        </Pressable>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>Dodaj nowy wpis (POST)</Text>
          <TextInput placeholder="Tytuł" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput placeholder="Treść" value={body} onChangeText={setBody} style={[styles.input, styles.textarea]} multiline />
          <TextInput placeholder="User ID (np. 1)" value={userId} onChangeText={setUserId} keyboardType="numeric" style={styles.input} />
          <Button title="Wyślij na serwer (POST)" onPress={addPost} />
        </View>
      </KeyboardAvoidingView>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => <PostCard post={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1, padding:12},
  form: {marginBottom:12, backgroundColor:'#f9f9f9', padding:10, borderRadius:8, borderWidth:1, borderColor:'#eee'},
  formTitle: {fontSize:14, fontWeight:'700', marginBottom:8, color:'#555'},
  input: {borderWidth:1,borderColor:'#ddd',padding:8,borderRadius:6,marginBottom:8,backgroundColor:'#fff'},
  textarea: {height:75,textAlignVertical:'top'},
  header:{marginBottom:8},
  title:{fontSize:20,fontWeight:'600'},
  reload:{marginTop:6,padding:6,backgroundColor:'#007AFF',borderRadius:6,alignSelf:'flex-start'},
  reloadText:{color:'#fff'},
  errorBanner: {padding:10, backgroundColor:'#ffebe9', borderRadius:6, marginBottom:10, borderWidth:1, borderColor:'#ffc1c0'},
  errorText: {color:'#d12420', fontWeight:'500'},
  loader: {marginVertical: 20}
});
