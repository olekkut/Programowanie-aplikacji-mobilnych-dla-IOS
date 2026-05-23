import { Pressable, StyleSheet, Text, View } from 'react-native';

type SettingsRowProps = {
  title: string;
  description: string;
  value: string;
  onPress?: () => void;
  highlight?: boolean;
  theme: {
    card: string;
    elevatedCard: string;
    text: string;
    mutedText: string;
    inputBorder: string;
    accent: string;
  };
};

export function SettingsRow({
  title,
  description,
  value,
  onPress,
  highlight = false,
  theme
}: SettingsRowProps) {
  const styles = StyleSheet.create({
    row: {
      backgroundColor: highlight ? theme.elevatedCard : theme.card,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: highlight ? theme.accent : theme.inputBorder,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      marginBottom: 12
    },
    textBlock: {
      flex: 1
    },
    title: {
      color: theme.text,
      fontSize: 16,
      fontWeight: '800',
      marginBottom: 4
    },
    description: {
      color: theme.mutedText,
      lineHeight: 19
    },
    value: {
      color: highlight ? '#ffcf6b' : theme.text,
      fontWeight: '800'
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.99 }]
    }
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && onPress && styles.pressed
      ]}
    >
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </Pressable>
  );
}
