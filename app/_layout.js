import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function TabLayout() {
  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    if (Platform.OS === 'web') {
      return;
    }
    
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '週次ライフバランス診断',
            body: '今週のライフバランスをチェックしましょう！',
          },
          trigger: {
            weekday: 1,
            hour: 10,
            minute: 0,
            repeats: true,
          },
        });
      }
    } catch (error) {
      console.log('Notification setup failed:', error);
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'index') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'results') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'history') {
            iconName = focused ? 'time' : 'time-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#FF6B6B',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ title: '診断' }}
      />
      <Tabs.Screen 
        name="results" 
        options={{ title: '結果' }}
      />
      <Tabs.Screen 
        name="history" 
        options={{ title: '履歴' }}
      />
    </Tabs>
  );
}