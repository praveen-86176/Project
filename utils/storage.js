import AsyncStorage from '@react-native-async-storage/async-storage';

const HABITS_KEY = '@habits_key';
const THEME_KEY = '@theme_key';

// Habits storage
export const saveHabits = async (habits) => {
  try {
    const jsonValue = JSON.stringify(habits);
    await AsyncStorage.setItem(HABITS_KEY, jsonValue);
  } catch (e) {
    // Silently handle storage errors - user can retry
    __DEV__ && console.warn('Error saving habits:', e.message);
  }
};

export const loadHabits = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(HABITS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    __DEV__ && console.warn('Error loading habits:', e.message);
    return [];
  }
};

export const deleteHabit = async (id, currentHabits) => {
  try {
    const updatedHabits = currentHabits.filter(habit => habit.id !== id);
    await saveHabits(updatedHabits);
    return updatedHabits;
  } catch (e) {
    __DEV__ && console.warn('Error deleting habit:', e.message);
    return currentHabits;
  }
};

// Theme storage
export const saveTheme = async (isDark) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, JSON.stringify(isDark));
  } catch (e) {
    __DEV__ && console.warn('Error saving theme:', e.message);
  }
};

export const loadTheme = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(THEME_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : false;
  } catch (e) {
    __DEV__ && console.warn('Error loading theme:', e.message);
    return false;
  }
};
