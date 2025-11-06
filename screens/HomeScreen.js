import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import AddHabit from '../components/AddHabit';
import HabitItem from '../components/HabitItem';
import { loadHabits, saveHabits, deleteHabit } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const { theme } = useTheme();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fallback quotes for offline mode
  const fallbackQuotes = [
    { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
    { text: 'Motivation gets you started. Habit keeps you going.', author: 'Jim Rohn' },
    { text: 'Don’t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
    { text: 'Small daily improvements are the key to staggering long-term results.', author: 'James Clear' },
    { text: 'It always seems impossible until it’s done.', author: 'Nelson Mandela' },
    { text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu' },
    { text: 'Excellence is not an act, but a habit.', author: 'Aristotle' },
    { text: 'Do something today that your future self will thank you for.', author: 'Sean Patrick Flanery' },
    { text: 'Success doesn’t come from what you do occasionally, it comes from what you do consistently.', author: 'Marie Forleo' },
    { text: 'We are what we repeatedly do. Greatness, then, is not an act but a habit.', author: 'Will Durant' }
  ];

  useFocusEffect(
    useCallback(() => {
      loadHabitsData();
    }, [])
  );

  useEffect(() => {
    let isMounted = true;
    let timeoutId;
    let retryTimeoutId;

    const fetchQuoteWithRetry = async (retryCount = 0) => {
      if (!isMounted) return;

      setQuoteLoading(true);
      setQuoteError(false);

      try {
        // Use quotable.io - CORS-friendly and reliable
        const apiUrl = 'https://api.quotable.io/random?maxLength=150';
        const controller = new AbortController();
        
        // Set timeout for fetch (5 seconds)
        timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        // Handle rate limit (429) specifically
        if (response.status === 429) {
          const retryAfter = response.headers.get('Retry-After');
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, retryCount) * 2000;
          
          if (retryCount < 2 && isMounted) {
            __DEV__ && console.warn('Rate limit hit, retrying after', delay, 'ms');
            retryTimeoutId = setTimeout(() => {
              if (isMounted) {
                fetchQuoteWithRetry(retryCount + 1);
              }
            }, delay);
            return;
          }
          throw new Error('Rate limit exceeded');
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!isMounted) return;

        // quotable.io returns { content, author } format
        if (data && data.content && data.author) {
          setQuote({
            text: data.content,
            author: data.author || 'Unknown',
          });
          setQuoteError(false);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (!isMounted) return;

        // Retry logic: exponential backoff (max 2 retries)
        // Skip retry for AbortError (timeout) or if it's not a network error
        const isRetriable = error.name !== 'AbortError' && 
                           error.message !== 'Rate limit exceeded' &&
                           !error.message.includes('Invalid API response');
        
        if (retryCount < 2 && isRetriable) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s
          __DEV__ && console.warn(`Quote fetch failed, retrying in ${delay}ms...`, error.message);
          retryTimeoutId = setTimeout(() => {
            if (isMounted) {
              fetchQuoteWithRetry(retryCount + 1);
            }
          }, delay);
          return;
        }

        // Use fallback quote if all retries fail
        if (isMounted) {
          __DEV__ && console.warn('Using fallback quote after API failure:', error.message);
          const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
          setQuote(randomQuote);
          setQuoteError(true);
        }
      } finally {
        if (isMounted) {
          setQuoteLoading(false);
        }
      }
    };

    fetchQuoteWithRetry();

    // Cleanup function
    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
    };
  }, []);

  const loadHabitsData = async () => {
    try {
      const loadedHabits = await loadHabits();
      setHabits(loadedHabits);
    } catch (error) {
      Alert.alert('Error', 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuote = async () => {
    setQuoteLoading(true);
    setQuoteError(false);

    try {
      // Use quotable.io - CORS-friendly and reliable
      const apiUrl = 'https://api.quotable.io/random?maxLength=150';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(apiUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      // Handle rate limit (429) specifically
      if (response.status === 429) {
        __DEV__ && console.warn('Rate limit hit, using fallback quote');
        throw new Error('Rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // quotable.io returns { content, author } format
      if (data && data.content && data.author) {
        setQuote({
          text: data.content,
          author: data.author || 'Unknown',
        });
        setQuoteError(false);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      // Use fallback quote
      __DEV__ && console.warn('Quote fetch failed, using fallback:', error.message);
      const randomQuote = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomQuote);
      setQuoteError(true);
    } finally {
      setQuoteLoading(false);
    }
  };

  const handleAddHabit = async (newHabit) => {
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const handleToggleComplete = async (id) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );
    setHabits(updatedHabits);
    await saveHabits(updatedHabits);
  };

  const handleDeleteHabit = async (id) => {
    try {
      const updatedHabits = await deleteHabit(id, habits);
      setHabits(updatedHabits);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete habit');
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHabitsData();
    await fetchQuote();
    setRefreshing(false);
  }, []);

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const styles = getStyles(theme);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Quote Section */}
        <View style={styles.quoteContainer}>
          <LinearGradient
            colors={[theme.colors.cardBackground, theme.colors.overlay]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quoteGradient}
          >
            <View style={styles.quoteHeader}>
              <View style={styles.quoteIconContainer}>
                <Icon name="format-quote" size={28} color={theme.colors.primary} />
              </View>
              {quoteError && (
                <View style={styles.offlineBadge}>
                  <Icon name="wifi-off" size={14} color={theme.colors.warning} />
                  <Text style={styles.offlineText}>Offline</Text>
                </View>
              )}
            </View>
            {quoteLoading ? (
              <View style={styles.quoteLoaderContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
              </View>
            ) : (
              <View style={styles.quoteContent}>
                <Text style={styles.quoteText}>"{quote.text}"</Text>
                <Text style={styles.quoteAuthor}>— {quote.author}</Text>
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Progress Bar */}
        {totalCount > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <View style={styles.progressLeft}>
                <Icon name="trending-up" size={20} color={theme.colors.primary} />
                <Text style={styles.progressText}>
                  Today's Progress
                </Text>
              </View>
              <View style={styles.progressStats}>
                <Text style={styles.progressNumbers}>
                  {completedCount}/{totalCount}
                </Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(progress * 100)}%
                </Text>
              </View>
            </View>
            <View style={styles.progressBarBackground}>
              <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
              >
                <View style={styles.progressShine} />
              </LinearGradient>
            </View>
          </View>
        )}

        {/* Add Habit Component */}
        <AddHabit onAddHabit={handleAddHabit} theme={theme} />

        {/* Habits List */}
        <View style={styles.habitsHeader}>
          <Text style={styles.habitsHeaderText}>
            My Habits ({totalCount})
          </Text>
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.accent]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.emptyIconGradient}
              >
                <Icon name="add-task" size={48} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.emptyText}>Start Your Journey</Text>
            <Text style={styles.emptySubtext}>
              Create your first habit and begin building a better you today
            </Text>
            <View style={styles.emptyDecoration}>
              <View style={[styles.emptyDot, { backgroundColor: theme.colors.primary }]} />
              <View style={[styles.emptyDot, { backgroundColor: theme.colors.accent }]} />
              <View style={[styles.emptyDot, { backgroundColor: theme.colors.secondary }]} />
            </View>
          </View>
        ) : (
          <View style={styles.habitsListContainer}>
            {habits.map((item) => (
              <HabitItem
                key={item.id}
                habit={item}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteHabit}
                theme={theme}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteContainer: {
    marginBottom: 16,
    marginTop: 4,
    borderRadius: 16,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 4px 16px ${theme.colors.shadow}`,
    } : {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 6,
    }),
  },
  quoteGradient: {
    padding: 16,
    borderRadius: 16,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quoteIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  offlineText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.warning,
  },
  quoteLoaderContainer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  quoteContent: {
    marginTop: 2,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.text,
    marginBottom: 10,
    lineHeight: 20,
    fontWeight: '500',
  },
  quoteAuthor: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 16,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 2px 12px ${theme.colors.shadow}`,
    } : {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    }),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.1,
  },
  progressStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressNumbers: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  progressBarBackground: {
    height: 14,
    backgroundColor: theme.colors.border,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
    position: 'relative',
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
  },
  habitsHeader: {
    marginBottom: 12,
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  habitsHeaderText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  habitsListContainer: {
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 8px 24px ${theme.colors.shadow}`,
    } : {
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    }),
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  emptySubtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 18,
  },
  emptyDecoration: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 32,
  },
  emptyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.6,
  },
});

export default HomeScreen;
