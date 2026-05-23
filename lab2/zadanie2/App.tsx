import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { SettingsRow } from './components/SettingsRow';

type Profile = {
  name: string;
  email: string;
  city: string;
  bio: string;
};

type MessageState = {
  type: 'idle' | 'error' | 'success';
  text: string;
};

type ThemePalette = {
  screen: string;
  card: string;
  elevatedCard: string;
  text: string;
  mutedText: string;
  inputBackground: string;
  inputBorder: string;
  accent: string;
  accentText: string;
  successBackground: string;
  errorBackground: string;
  successText: string;
  errorText: string;
};

const bioLimit = 120;

const initialProfile: Profile = {
  name: 'Anna Nowak',
  email: 'anna.nowak@example.com',
  city: 'Katowice',
  bio: 'Interesuję się mobilnym UI, fotografią miejską i dobrym designem.'
};

const lightTheme: ThemePalette = {
  screen: '#f5f7fb',
  card: '#ffffff',
  elevatedCard: '#eef3ff',
  text: '#132238',
  mutedText: '#5f6f85',
  inputBackground: '#ffffff',
  inputBorder: '#d9e1ee',
  accent: '#0f4c81',
  accentText: '#ffffff',
  successBackground: '#e7f7ec',
  errorBackground: '#fdeceb',
  successText: '#1f6b3a',
  errorText: '#a63f31'
};

const darkTheme: ThemePalette = {
  screen: '#08111f',
  card: '#12213b',
  elevatedCard: '#162744',
  text: '#f5f8ff',
  mutedText: '#b8c7e0',
  inputBackground: '#0f1c32',
  inputBorder: '#274068',
  accent: '#7fb0ff',
  accentText: '#08111f',
  successBackground: '#163626',
  errorBackground: '#3d1f27',
  successText: '#89e0a5',
  errorText: '#ffb1af'
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [form, setForm] = useState<Profile>(initialProfile);
  const [message, setMessage] = useState<MessageState>({ type: 'idle', text: '' });

  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = createStyles(theme);

  const handleSave = () => {
    const validationErrors: string[] = [];

    if (!form.name.trim()) {
      validationErrors.push('Imię nie może być puste.');
    }

    if (!form.email.includes('@')) {
      validationErrors.push('E-mail musi zawierać znak @.');
    }

    if (form.bio.trim().length > bioLimit) {
      validationErrors.push(`Bio nie może przekraczać ${bioLimit} znaków.`);
    }

    if (validationErrors.length > 0) {
      setMessage({
        type: 'error',
        text: validationErrors.join(' ')
      });
      return;
    }

    setProfile(form);
    setMessage({
      type: 'success',
      text: 'Dane zostały zapisane poprawnie.'
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.kicker}>Panel użytkownika</Text>
          <Text style={styles.heroTitle}>Profil, formularz i ustawienia w jednym ekranie.</Text>
          <Text style={styles.heroSubtitle}>
            Dane są kontrolowane przez stan, a motyw jasny / ciemny zmienia wygląd całego widoku.
          </Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileMeta}>{profile.city}</Text>
          <Text style={styles.profileBio}>{profile.bio}</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Edytuj dane</Text>

          <Text style={styles.fieldLabel}>Imię</Text>
          <TextInput
            value={form.name}
            onChangeText={text => setForm(previous => ({ ...previous, name: text }))}
            placeholder="Wpisz imię"
            placeholderTextColor={theme.mutedText}
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>E-mail</Text>
          <TextInput
            value={form.email}
            onChangeText={text => setForm(previous => ({ ...previous, email: text }))}
            placeholder="Wpisz e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={theme.mutedText}
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>Miasto</Text>
          <TextInput
            value={form.city}
            onChangeText={text => setForm(previous => ({ ...previous, city: text }))}
            placeholder="Wpisz miasto"
            placeholderTextColor={theme.mutedText}
            style={styles.input}
          />

          <View style={styles.bioHeaderRow}>
            <Text style={styles.fieldLabel}>Bio</Text>
            <Text style={styles.bioCounter}>
              {form.bio.length}/{bioLimit}
            </Text>
          </View>
          <TextInput
            value={form.bio}
            onChangeText={text => setForm(previous => ({ ...previous, bio: text }))}
            placeholder="Dodaj krótkie bio"
            multiline
            placeholderTextColor={theme.mutedText}
            style={[styles.input, styles.bioInput]}
            textAlignVertical="top"
          />

          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
          >
            <Text style={styles.saveButtonText}>Zapisz zmiany</Text>
          </Pressable>

          {message.type !== 'idle' ? (
            <View
              style={[
                styles.messageBox,
                message.type === 'success' ? styles.successBox : styles.errorBox
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.type === 'success' ? styles.successText : styles.errorText
                ]}
              >
                {message.text}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Ustawienia</Text>

          <SettingsRow
            title="Powiadomienia"
            description="Dostajesz krótkie alerty o ważnych zmianach."
            value="Włączone"
            theme={theme}
          />
          <SettingsRow
            title="Prywatność"
            description="Widoczność profilu ustawiona na poziom podstawowy."
            value="Podstawowa"
            theme={theme}
          />
          <SettingsRow
            title="Ciemny motyw"
            description="Przełącza wygląd całego ekranu."
            value={isDarkMode ? 'Włączony' : 'Wyłączony'}
            onPress={() => setIsDarkMode(previous => !previous)}
            highlight
            theme={theme}
          />
          <SettingsRow
            title="O aplikacji"
            description="Wersja demonstracyjna przygotowana na potrzeby laboratorium."
            value="Info"
            theme={theme}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.screen
    },
    content: {
      padding: 16,
      paddingBottom: 28,
      gap: 16
    },
    heroCard: {
      backgroundColor: theme.elevatedCard,
      borderRadius: 28,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.inputBorder
    },
    kicker: {
      color: theme.accent,
      fontSize: 12,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 1.1,
      marginBottom: 8
    },
    heroTitle: {
      color: theme.text,
      fontSize: 26,
      lineHeight: 33,
      fontWeight: '900',
      marginBottom: 8
    },
    heroSubtitle: {
      color: theme.mutedText,
      lineHeight: 21
    },
    profileCard: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 18,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.inputBorder
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.accent,
      marginBottom: 14
    },
    avatarText: {
      color: theme.accentText,
      fontSize: 28,
      fontWeight: '900'
    },
    profileName: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '900',
      marginBottom: 4
    },
    profileMeta: {
      color: theme.mutedText,
      fontWeight: '700',
      marginBottom: 10
    },
    profileBio: {
      color: theme.text,
      textAlign: 'center',
      lineHeight: 21
    },
    sectionCard: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.inputBorder
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '900',
      marginBottom: 14
    },
    fieldLabel: {
      color: theme.mutedText,
      fontSize: 13,
      fontWeight: '800',
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.6
    },
    input: {
      backgroundColor: theme.inputBackground,
      borderColor: theme.inputBorder,
      borderWidth: 1,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 14,
      color: theme.text,
      marginBottom: 14,
      fontSize: 15
    },
    bioHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    bioCounter: {
      color: theme.mutedText,
      fontWeight: '800'
    },
    bioInput: {
      minHeight: 120
    },
    saveButton: {
      backgroundColor: theme.accent,
      borderRadius: 18,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 4
    },
    saveButtonText: {
      color: theme.accentText,
      fontWeight: '900',
      fontSize: 16
    },
    messageBox: {
      borderRadius: 16,
      padding: 14,
      marginTop: 14
    },
    successBox: {
      backgroundColor: theme.successBackground
    },
    errorBox: {
      backgroundColor: theme.errorBackground
    },
    messageText: {
      fontWeight: '700',
      lineHeight: 20
    },
    successText: {
      color: theme.successText
    },
    errorText: {
      color: theme.errorText
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.99 }]
    }
  });
}
