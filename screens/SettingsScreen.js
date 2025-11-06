import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { saveHabits } from '../utils/storage';

const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const handleResetAllHabits = () => {
    Alert.alert(
      'Reset All Habits',
      'Are you sure you want to delete all habits? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await saveHabits([]);
              // Navigate to Home screen which will automatically refresh
              navigation.navigate('Home');
              // Small delay to ensure navigation completes before showing alert
              setTimeout(() => {
                Alert.alert('Success', 'All habits have been reset');
              }, 300);
            } catch (error) {
              Alert.alert('Error', 'Failed to reset habits');
            }
          },
        },
      ]
    );
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={theme.colors.primaryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Icon name="dark-mode" size={20} color="#fff" />
                </LinearGradient>
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Toggle between light and dark theme
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="#fff"
              ios_backgroundColor={theme.colors.border}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleResetAllHabits}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <View style={[styles.iconContainer, styles.dangerIcon]}>
                <Icon name="delete-sweep" size={20} color={theme.colors.danger} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, styles.dangerText]}>
                  Reset All Habits
                </Text>
                <Text style={styles.settingDescription}>
                  Delete all habits permanently
                </Text>
              </View>
            </View>
            <Icon name="chevron-right" size={22} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerGradient}>
            <Icon name="favorite" size={16} color={theme.colors.accent} />
            <Text style={styles.footerText}>Habit Tracker v1.0.0</Text>
          </View>
          <Text style={styles.footerSubtext}>
            Built with React Native & Expo
          </Text>
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...(Platform.OS === 'web' ? {
      boxShadow: `0 2px 6px ${theme.colors.shadow}`,
    } : {
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 2,
    }),
  },
  dangerItem: {
    borderColor: theme.colors.danger + '40',
    backgroundColor: theme.colors.danger + '05',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerIcon: {
    backgroundColor: theme.colors.danger + '15',
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 3,
    letterSpacing: 0,
  },
  settingDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  dangerText: {
    color: theme.colors.danger,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.2,
  },
  footerSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
});

export default SettingsScreen;
