import { useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { EventCard, EventCategory, EventItem } from './components/EventCard';

type FilterCategory = 'Wszystkie' | EventCategory;

const initialEvents: EventItem[] = [
  {
    id: '1',
    title: 'Warsztaty z React Native',
    date: '24.03.2026',
    category: 'Nauka',
    location: 'Aula 3',
    favorite: false,
    badge: 'Nowe'
  },
  {
    id: '2',
    title: 'Bieg akademicki 5 km',
    date: '26.03.2026',
    category: 'Sport',
    location: 'Park Miejski',
    favorite: true,
    badge: 'Popularne'
  },
  {
    id: '3',
    title: 'Wieczór filmowy: klasyka kina',
    date: '28.03.2026',
    category: 'Film',
    location: 'Kino Studyjne',
    favorite: false,
    badge: null
  },
  {
    id: '4',
    title: 'Jam session dla studentów',
    date: '29.03.2026',
    category: 'Muzyka',
    location: 'Klub studencki',
    favorite: false,
    badge: 'Nowe'
  },
  {
    id: '5',
    title: 'Przegląd projektów z programowania',
    date: '31.03.2026',
    category: 'Nauka',
    location: 'Sala konferencyjna',
    favorite: true,
    badge: null
  }
];

const categories: FilterCategory[] = ['Wszystkie', 'Nauka', 'Sport', 'Muzyka', 'Film'];

export default function App() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('Wszystkie');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const filteredEvents = events.filter(event => {
    const matchesQuery = event.title.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesCategory = activeCategory === 'Wszystkie' || event.category === activeCategory;
    const matchesFavorite = !onlyFavorites || event.favorite;

    return matchesQuery && matchesCategory && matchesFavorite;
  });

  const toggleFavorite = (eventId: string) => {
    setEvents(previousEvents =>
      previousEvents.map(event =>
        event.id === eventId ? { ...event, favorite: !event.favorite } : event
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.heroCard}>
              <Text style={styles.kicker}>Katalog wydarzeń</Text>
              <Text style={styles.title}>Wybierz wydarzenie, filtruj i zapisuj ulubione.</Text>
              <Text style={styles.subtitle}>
                Wyniki są wyliczane na podstawie wyszukiwania, kategorii i trybu ulubionych.
              </Text>
            </View>

            <View style={styles.counterCard}>
              <Text style={styles.counterLabel}>Widoczne wyniki</Text>
              <Text style={styles.counterValue}>{filteredEvents.length}</Text>
            </View>

            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Szukaj wydarzenia"
              placeholderTextColor="#8ea0bf"
              autoCapitalize="none"
              style={styles.searchInput}
            />

            <View style={styles.filterRow}>
              {categories.map(category => {
                const isActive = activeCategory === category;

                return (
                  <Pressable
                    key={category}
                    onPress={() => setActiveCategory(category)}
                    style={({ pressed }) => [
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                      pressed && styles.pressed
                    ]}
                  >
                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              onPress={() => setOnlyFavorites(previous => !previous)}
              style={({ pressed }) => [
                styles.favoriteToggle,
                onlyFavorites && styles.favoriteToggleActive,
                pressed && styles.pressed
              ]}
            >
              <Text style={[styles.favoriteToggleText, onlyFavorites && styles.favoriteToggleTextActive]}>
                {onlyFavorites ? 'Pokaż wszystkie' : 'Tylko ulubione'}
              </Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Brak wyników</Text>
            <Text style={styles.emptyText}>Zmień frazę wyszukiwania lub wybierz inną kategorię.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            title={item.title}
            date={item.date}
            category={item.category}
            location={item.location}
            favorite={item.favorite}
            badge={item.badge}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#08111f'
  },
  listContent: {
    padding: 16,
    paddingBottom: 28
  },
  headerBlock: {
    marginBottom: 8
  },
  heroCard: {
    backgroundColor: '#0f1c32',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14
  },
  kicker: {
    color: '#7fb0ff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8
  },
  title: {
    color: '#ffffff',
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '900',
    marginBottom: 8
  },
  subtitle: {
    color: '#b7c7e3',
    fontSize: 14,
    lineHeight: 21
  },
  counterCard: {
    backgroundColor: '#13233f',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  counterLabel: {
    color: '#c6d7f0',
    fontSize: 14,
    fontWeight: '700'
  },
  counterValue: {
    color: '#ffcf6b',
    fontSize: 26,
    fontWeight: '900'
  },
  searchInput: {
    backgroundColor: '#13233f',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    color: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 14
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14
  },
  filterChip: {
    backgroundColor: '#13233f',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)'
  },
  filterChipActive: {
    backgroundColor: '#7fb0ff',
    borderColor: '#7fb0ff'
  },
  filterChipText: {
    color: '#d2def0',
    fontWeight: '700'
  },
  filterChipTextActive: {
    color: '#08111f'
  },
  favoriteToggle: {
    alignSelf: 'flex-start',
    backgroundColor: '#1c2944',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 18
  },
  favoriteToggleActive: {
    backgroundColor: '#ffcf6b'
  },
  favoriteToggleText: {
    color: '#d8e4f5',
    fontWeight: '800'
  },
  favoriteToggleTextActive: {
    color: '#1c1708'
  },
  separator: {
    height: 0
  },
  emptyState: {
    backgroundColor: '#13233f',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    marginTop: 8
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6
  },
  emptyText: {
    color: '#b8c7e0',
    textAlign: 'center',
    lineHeight: 20
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }]
  }
});
