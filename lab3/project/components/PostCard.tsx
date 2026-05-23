import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type Post = { id: number; title: string; body: string };

export default function PostCard({post}: {post: Post}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{post.id}. {post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{padding:12,marginVertical:6,backgroundColor:'#fff',borderRadius:8,shadowColor:'#000',shadowOpacity:0.05,shadowRadius:4,elevation:1},
  title:{fontWeight:'600',marginBottom:6},
  body:{color:'#333'}
});
