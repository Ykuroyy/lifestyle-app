import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import AssessmentScreen from './app/index';
import ResultsScreen from './app/results';
import HistoryScreen from './app/history';

const Tab = createBottomTabNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [assessmentData, setAssessmentData] = useState(null);

  useEffect(() => {
    // エラーハンドリングを追加
    const handleError = (error) => {
      console.log('Handled error:', error.message);
    };
    
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    setupNotifications();
    loadAssessmentData();
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
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

  const loadAssessmentData = async () => {
    try {
      const data = await AsyncStorage.getItem('latestAssessment');
      if (data) {
        setAssessmentData(JSON.parse(data));
      }
    } catch (error) {
      console.error('データの読み込みに失敗しました:', error);
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === '診断') {
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            } else if (route.name === '結果') {
              iconName = focused ? 'pie-chart' : 'pie-chart-outline';
            } else if (route.name === '履歴') {
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
        <Tab.Screen 
          name="診断" 
          component={AssessmentScreen}
          initialParams={{ setAssessmentData }}
        />
        <Tab.Screen 
          name="結果" 
          component={ResultsScreen}
          initialParams={{ assessmentData }}
        />
        <Tab.Screen 
          name="履歴" 
          component={HistoryScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}