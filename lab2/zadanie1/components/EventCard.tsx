import { Pressable, StyleSheet, Text, View } from 'react-native';

export type EventCategory = 'Nauka' | 'Sport' | 'Muzyka' | 'Film';

export type EventItem = {
  id: string;
  title: string;
  date: string;
  category: EventCategory;
  location: string;
  favorite: boolean;
  badge: 'Nowe' | 'Popularne' | null;
};

type EventCardProps = {
  title: string;
  date: string;
  category: EventCategory;
  location: string;
  favorite: boolean;
  badge: EventItem['badge'];
  onToggleFavorite: () => void;
};

export function EventCard({
  title,
  date,
  category,
  location,
  favorite,
  badge,
  onToggleFavorite
}: EventCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{category}</Text>
        </View>
        {badge ? (
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>Data: {date}</Text>
        <Text style={styles.meta}>Miejsce: {location}</Text>
      </View>

      <Pressable
        onPress={onToggleFavorite}
        style={({ pressed }) => [
          styles.actionButton,
          favorite && styles.actionButtonActive,
          pressed && styles.pressed
        ]}
      >
        <Text style={[styles.actionText, favorite && styles.actionTextActive]}>
          {favorite ? 'W ulubionych' : 'Zapisz'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#13233f',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 14,
    shadowColor: '#0a1020',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10
  },
  categoryBadge: {
    backgroundColor: 'rgba(106, 178, 255, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  categoryBadgeText: {
    color: '#cfe4ff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  badgePill: {
    backgroundColor: 'rgba(255, 199, 95, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999
  },
  badgeText: {
    color: '#ffd57a',
    fontSize: 12,
    fontWeight: '700'
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10
  },
  metaRow: {
    gap: 6,
    marginBottom: 14
  },
  meta: {
    color: '#b8c7e0',
    fontSize: 14,
    lineHeight: 20
  },
  actionButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f0ff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14
  },
  actionButtonActive: {
    backgroundColor: '#ffcf6b'
  },
  actionText: {
    color: '#14233e',
    fontWeight: '800'
  },
  actionTextActive: {
    color: '#1f1a0c'
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }]
  }
});
