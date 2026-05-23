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

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const cached = await AsyncStorage.getItem('posts-json');
      if (cached) {
        setPosts(JSON.parse(cached));
        setLoading(false);
      }

      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=20');
      const data: Post[] = await res.json();
      setPosts(data);
      await AsyncStorage.setItem('posts-json', JSON.stringify(data));
    } catch (e) {
      console.warn('Fetch or storage error', e);
    } finally {
      setLoading(false);
    }
  }

  function clearCache() {
    AsyncStorage.removeItem('posts-json').then(() => loadData());
  }

  async function addPost() {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Błąd', 'Podaj tytuł i treść');
      return;
    }

    const newId = posts.length ? Math.max(...posts.map(p=>p.id)) + 1 : Date.now();
    const newPost: Post = { id: newId, title: title.trim(), body: body.trim() };
    const updated = [newPost, ...posts];
    setPosts(updated);
    await AsyncStorage.setItem('posts-json', JSON.stringify(updated));
    setTitle('');
    setBody('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lab3 — JSON & Sieć</Text>
        <Pressable onPress={clearCache} style={styles.reload}>
          <Text style={styles.reloadText}>Odśwież (usuń cache)</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.form}>
          <TextInput placeholder="Tytuł" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput placeholder="Treść" value={body} onChangeText={setBody} style={[styles.input, styles.textarea]} multiline />
          <Button title="Dodaj wpis lokalny" onPress={addPost} />
        </View>
      </KeyboardAvoidingView>

      {loading ? (
        <ActivityIndicator size="large" />
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
  form: {marginBottom:12, backgroundColor:'#f9f9f9', padding:8, borderRadius:8},
  input: {borderWidth:1,borderColor:'#ddd',padding:8,borderRadius:6,marginBottom:8,backgroundColor:'#fff'},
  textarea: {height:80,textAlignVertical:'top'},
  header:{marginBottom:8},
  title:{fontSize:20,fontWeight:'600'},
  reload:{marginTop:6,padding:6,backgroundColor:'#007AFF',borderRadius:6,alignSelf:'flex-start'},
  reloadText:{color:'#fff'}
});
