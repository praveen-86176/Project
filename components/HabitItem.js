import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons as Icon } from '@expo/vector-icons';

const HabitItem = ({ habit, onToggleComplete, onDelete, theme }) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(habit.id),
        },
      ]
    );
  };

  const itemStyles = styles(theme);

  return (
    <View style={itemStyles.container}>
      <TouchableOpacity
        style={itemStyles.checkboxContainer}
        onPress={() => onToggleComplete(habit.id)}
        activeOpacity={0.7}
      >
        {habit.completed ? (
          <LinearGradient
            colors={theme.colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={itemStyles.checkboxGradient}
          >
            <Icon name="check" size={16} color="#fff" />
          </LinearGradient>
        ) : (
          <View style={itemStyles.checkbox}>
            <View style={itemStyles.checkboxInner} />
          </View>
        )}
      </TouchableOpacity>

      <View style={itemStyles.habitContent}>
        <Text
          style={[
            itemStyles.habitName,
            habit.completed && itemStyles.habitNameCompleted
          ]}
        >
          {habit.name}
        </Text>
        {habit.completed && (
          <View style={itemStyles.completedBadge}>
            <Icon name="done-all" size={12} color={theme.colors.success} />
            <Text style={itemStyles.completedText}>Completed</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={itemStyles.deleteButton}
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <View style={itemStyles.deleteButtonContainer}>
          <Icon name="delete-outline" size={20} color={theme.colors.danger} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = (theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 2px 8px ${theme.colors.shadow}`,
    } : {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    }),
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primary + '20',
  },
  checkboxGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 2px 6px ${theme.colors.primary}40`,
    } : {
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    }),
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: '600',
    marginBottom: 3,
    letterSpacing: 0,
    lineHeight: 20,
  },
  habitNameCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
    color: theme.colors.textSecondary,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.success + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginTop: 2,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.success,
  },
  deleteButton: {
    marginLeft: 12,
  },
  deleteButtonContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.danger + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HabitItem;
