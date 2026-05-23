import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Pressable,
  Platform,
  RefreshControl,
  Alert,
  FlatList
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

type WeatherData = {
  latitude: number;
  longitude: number;
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
    time: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
  };
};

type HourlyItem = {
  time: string;
  temp: number;
  prob: number;
};

type StatCardProps = {
  label: string;
  value: string | number;
  emoji: string;
};

function StatCard({ label, value, emoji }: StatCardProps) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label} {emoji}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function getWeatherDescription(code: number): { text: string; emoji: string } {
  if (code === 0) return { text: 'Czyste niebo', emoji: '☀️' };
  if ([1, 2, 3].includes(code)) return { text: 'Zachmurzenie', emoji: '🌤️' };
  if ([45, 48].includes(code)) return { text: 'Mgła', emoji: '🌫️' };
  if ([51, 53, 55].includes(code)) return { text: 'Mżawka', emoji: '🌧️' };
  if ([61, 63, 65].includes(code)) return { text: 'Deszcz', emoji: '🌧️' };
  if ([71, 73, 75, 77].includes(code)) return { text: 'Śnieg', emoji: '❄️' };
  if ([80, 81, 82].includes(code)) return { text: 'Ulewny deszcz', emoji: '🌦️' };
  if ([85, 86].includes(code)) return { text: 'Opady śniegu', emoji: '🌨️' };
  if ([95, 96, 99].includes(code)) return { text: 'Burza', emoji: '⛈️' };
  return { text: 'Nieznana', emoji: '🌈' };
}

function formatHour(isoString: string): string {
  try {
    const parts = isoString.split('T');
    if (parts.length === 2) {
      return parts[1].substring(0, 5); // Zwraca "HH:MM"
    }
  } catch (e) {}
  return isoString;
}

function getNext24h(data: WeatherData): HourlyItem[] {
  try {
    const nowStr = new Date().toISOString().substring(0, 13) + ':00';
    let startIndex = data.hourly.time.findIndex((t: string) => t >= nowStr);
    if (startIndex === -1) startIndex = 0;

    const next24h: HourlyItem[] = [];
    for (let i = startIndex; i < startIndex + 24 && i < data.hourly.time.length; i++) {
      next24h.push({
        time: data.hourly.time[i],
        temp: data.hourly.temperature_2m[i],
        prob: data.hourly.precipitation_probability[i]
      });
    }
    return next24h;
  } catch (e) {
    return [];
  }
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    loadLocationAndWeather();
  }, []);

  const getWeatherData = async (lat: number, lon: number) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&hourly=temperature_2m,precipitation_probability&forecast_days=2`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Błąd API pogodowego (Status ${res.status})`);
    }
    const data: WeatherData = await res.json();
    return data;
  };

  const loadFromCache = async (): Promise<boolean> => {
    try {
      const cached = await AsyncStorage.getItem('weather-cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        setWeather(parsed.data);
        setLastUpdated(parsed.timestamp);
        setIsCached(true);
        return true;
      }
    } catch (e) {
      console.warn('AsyncStorage read error', e);
    }
    return false;
  };

  const loadLocationAndWeather = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // 1. Uprawnienia lokalizacyjne
      const { status } = await Location.requestForegroundPermissionsAsync();
      setPermissionStatus(status);

      if (status !== Location.PermissionStatus.GRANTED) {
        await loadFromCache();
        setError('Brak uprawnień do lokalizacji. Wyświetlam ostatnio zapisane dane.');
        return;
      }

      // 2. Usługi lokalizacyjne w urządzeniu
      const hasServices = await Location.hasServicesEnabledAsync();
      if (!hasServices) {
        await loadFromCache();
        setError('Usługi lokalizacyjne są wyłączone w urządzeniu. Wyświetlam dane z cache.');
        return;
      }

      // 3. Pobranie lokalizacji
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = pos.coords;

      // 4. Pobranie pogody z API
      const weatherData = await getWeatherData(latitude, longitude);
      
      setWeather(weatherData);
      setIsCached(false);
      
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastUpdated(now);
      
      // Zapis cache
      await AsyncStorage.setItem('weather-cache', JSON.stringify({
        data: weatherData,
        timestamp: now
      }));

    } catch (e: any) {
      console.warn(e);
      const loaded = await loadFromCache();
      if (loaded) {
        setError(`Problem z połączeniem/GPS: ${e.message}. Wyświetlam dane z pamięci podręcznej.`);
      } else {
        setError(`Nie udało się pobrać danych: ${e.message}`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadLocationAndWeather(true)} />
        }
      >
        <Text style={styles.headerTitle}>🌤️ Pogoda Tu i Teraz</Text>

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loaderText}>Pobieranie lokalizacji i prognozy...</Text>
          </View>
        ) : (
          <>
            {permissionStatus !== Location.PermissionStatus.GRANTED && !weather ? (
              <View style={styles.noPermissionCard}>
                <Text style={styles.noPermissionText}>
                  Aplikacja wymaga dostępu do lokalizacji GPS, aby wyświetlić pogodę dla Twojego regionu.
                </Text>
                <Pressable style={styles.button} onPress={() => loadLocationAndWeather()}>
                  <Text style={styles.buttonText}>Nadaj uprawnienia i spróbuj ponownie</Text>
                </Pressable>
              </View>
            ) : weather ? (
              <>
                {/* Karta Główna Pogody */}
                <View style={styles.mainCard}>
                  {isCached && (
                    <View style={styles.cacheBadge}>
                      <Text style={styles.cacheBadgeText}>Tryb Offline (Dane z cache)</Text>
                    </View>
                  )}

                  <Text style={styles.emoji}>
                    {getWeatherDescription(weather.current.weather_code).emoji}
                  </Text>
                  
                  <Text style={styles.temp}>{Math.round(weather.current.temperature_2m)}°C</Text>
                  <Text style={styles.condition}>
                    {getWeatherDescription(weather.current.weather_code).text}
                  </Text>

                  <Text style={styles.gpsInfo}>
                    Lokalizacja: {weather.latitude.toFixed(3)}°N, {weather.longitude.toFixed(3)}°E
                  </Text>
                  {lastUpdated && (
                    <Text style={styles.updateTime}>Aktualizacja: {lastUpdated}</Text>
                  )}
                </View>

                {/* Statystyki Szczegółowe */}
                <View style={styles.statsGrid}>
                  <StatCard label="Wiatr" value={`${weather.current.wind_speed_10m} km/h`} emoji="💨" />
                  <StatCard label="Wilgotność" value={`${weather.current.relative_humidity_2m}%`} emoji="💧" />
                  <StatCard label="Opad" value={`${weather.current.precipitation} mm`} emoji="🌧️" />
                </View>

                {/* Prognoza Godzinowa */}
                <Text style={styles.sectionTitle}>Prognoza na najbliższe 24h</Text>
                <FlatList
                  horizontal
                  data={getNext24h(weather)}
                  keyExtractor={(_, index) => index.toString()}
                  showsHorizontalScrollIndicator={false}
                  style={styles.hourlyScroll}
                  renderItem={({ item }) => (
                    <View style={styles.hourlyItem}>
                      <Text style={styles.hourlyTime}>{formatHour(item.time)}</Text>
                      <Text style={styles.hourlyEmoji}>{item.prob > 30 ? '🌧️' : '🌤️'}</Text>
                      <Text style={styles.hourlyTemp}>{Math.round(item.temp)}°C</Text>
                      <Text style={styles.hourlyProb}>{item.prob}% opad</Text>
                    </View>
                  )}
                />
              </>
            ) : (
              <View style={styles.noPermissionCard}>
                <Text style={styles.noPermissionText}>Brak dostępnych danych pogodowych.</Text>
                <Pressable style={styles.button} onPress={() => loadLocationAndWeather()}>
                  <Text style={styles.buttonText}>Spróbuj ponownie</Text>
                </Pressable>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F6F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A2530',
    textAlign: 'center',
    marginVertical: 16,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 60,
  },
  loaderText: {
    marginTop: 12,
    color: '#5A6E7F',
    fontSize: 15,
  },
  errorCard: {
    backgroundColor: '#FFEBEA',
    borderColor: '#FFD1CF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#D12420',
    fontSize: 14,
    textAlign: 'center',
  },
  noPermissionCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EEF4',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginVertical: 20,
  },
  noPermissionText: {
    fontSize: 15,
    color: '#4C6070',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mainCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6EEF4',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 16,
    position: 'relative',
  },
  cacheBadge: {
    position: 'absolute',
    top: 12,
    backgroundColor: '#FF9500',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  cacheBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emoji: {
    fontSize: 64,
    marginTop: 8,
    marginBottom: 8,
  },
  temp: {
    fontSize: 48,
    fontWeight: '700',
    color: '#1A2530',
  },
  condition: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4C6070',
    marginBottom: 16,
  },
  gpsInfo: {
    fontSize: 13,
    color: '#8A9BA8',
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 12,
    color: '#8A9BA8',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '31%',
    borderWidth: 1,
    borderColor: '#E6EEF4',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#8A9BA8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A2530',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A2530',
    marginBottom: 12,
  },
  hourlyScroll: {
    paddingVertical: 4,
  },
  hourlyItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginRight: 10,
    width: 80,
    borderWidth: 1,
    borderColor: '#E6EEF4',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  hourlyTime: {
    fontSize: 12,
    color: '#8A9BA8',
    fontWeight: '500',
  },
  hourlyEmoji: {
    fontSize: 24,
    marginVertical: 6,
  },
  hourlyTemp: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A2530',
  },
  hourlyProb: {
    fontSize: 10,
    color: '#007AFF',
    marginTop: 4,
  },
});
