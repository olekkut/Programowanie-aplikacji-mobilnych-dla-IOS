import { Pressable, StyleSheet, Text, View } from 'react-native';

type SettingsRowProps = {
  title: string;
  description: string;
  value: string;
  onPress?: () => void;
  highlight?: boolean;
};

export function SettingsRow({
  title,
  description,
  value,
  onPress,
  highlight = false
}: SettingsRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        highlight && styles.highlightRow,
        pressed && onPress && styles.pressed
      ]}
    >
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={[styles.value, highlight && styles.highlightValue]}>{value}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#16213a',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  highlightRow: {
    backgroundColor: '#23345a',
    borderColor: '#7fb0ff'
  },
  textBlock: {
    flex: 1
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4
  },
  description: {
    color: '#b8c7e0',
    lineHeight: 19
  },
  value: {
    color: '#dbe7f7',
    fontWeight: '800'
  },
  highlightValue: {
    color: '#ffcf6b'
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }]
  }
});
