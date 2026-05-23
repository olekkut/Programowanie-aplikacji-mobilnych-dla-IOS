import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Pressable, View } from 'react-native';

import EventScreen from './screens/EventScreen';
import UserScreen from './screens/UserScreen';

export default function App() {
  const [screen, setScreen] = useState<'events' | 'user'>('events');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => setScreen('events')} style={styles.tab}>
          <Text style={styles.tabText}>Katalog wydarzeń</Text>
        </Pressable>
        <Pressable onPress={() => setScreen('user')} style={styles.tab}>
          <Text style={styles.tabText}>Panel użytkownika</Text>
        </Pressable>
      </View>

      {screen === 'events' ? <EventScreen /> : <UserScreen />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111f'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#0f1c32'
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  tabText: {
    color: '#fff',
    fontWeight: '800'
  }
});
