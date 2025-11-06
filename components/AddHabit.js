import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const AddHabit = ({ onAddHabit, theme }) => {
  const [habitName, setHabitName] = useState('');

  const handleAdd = () => {
    if (habitName.trim() === '') {
      Alert.alert('Validation Error', 'Please enter a habit name');
      return;
    }

    const newHabit = {
      id: Date.now().toString(),
      name: habitName.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAddHabit(newHabit);
    setHabitName('');
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <View style={styles.iconWrapper}>
          <Icon name="add-task" size={22} color={theme.colors.primary} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter a new habit..."
          placeholderTextColor={theme.colors.textSecondary}
          value={habitName}
          onChangeText={setHabitName}
          onSubmitEditing={handleAdd}
        />
      </View>
      <TouchableOpacity 
        style={styles.addButtonWrapper} 
        onPress={handleAdd}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={theme.colors.primaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.addButton}
        >
          <Icon name="add-circle" size={22} color="#fff" />
          <Text style={styles.addButtonText}>Add Habit</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 2px 6px ${theme.colors.shadow}`,
    } : {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    }),
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '500',
  },
  addButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 3px 12px ${theme.colors.primary}30`,
    } : {
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 5,
    }),
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});

export default AddHabit;
