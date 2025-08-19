import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const categories = [
  { key: 'health', name: '健康', icon: '🏃‍♀️' },
  { key: 'work', name: '仕事', icon: '💼' },
  { key: 'hobby', name: '趣味', icon: '🎨' },
  { key: 'relationships', name: '人間関係', icon: '👥' },
  { key: 'learning', name: '学び', icon: '📚' },
];

export default function AssessmentScreen() {
  const [scores, setScores] = useState({
    health: 5,
    work: 5,
    hobby: 5,
    relationships: 5,
    learning: 5,
  });

  const updateScore = (category, value) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const saveAssessment = async () => {
    try {
      const assessment = {
        scores,
        date: new Date().toISOString(),
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem('latestAssessment', JSON.stringify(assessment));
      
      const history = await AsyncStorage.getItem('assessmentHistory');
      const historyArray = history ? JSON.parse(history) : [];
      historyArray.push(assessment);
      await AsyncStorage.setItem('assessmentHistory', JSON.stringify(historyArray));

      Alert.alert(
        '診断完了',
        '今週のライフバランス診断が保存されました！',
        [
          {
            text: '結果を見る',
            onPress: () => router.push('/results'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('エラー', 'データの保存に失敗しました');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>今週のライフバランスをチェック</Text>
      <Text style={styles.subtitle}>
        各項目について1（とても低い）〜10（とても高い）で評価してください
      </Text>

      {categories.map((category) => (
        <View key={category.key} style={styles.categoryContainer}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={styles.categoryName}>{category.name}</Text>
            <Text style={styles.scoreText}>{Math.round(scores[category.key])}</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            value={scores[category.key]}
            onValueChange={(value) => updateScore(category.key, value)}
            step={1}
            minimumTrackTintColor="#FF6B6B"
            maximumTrackTintColor="#DDDDDD"
            thumbStyle={styles.thumb}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>低い</Text>
            <Text style={styles.sliderLabel}>高い</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={saveAssessment}>
        <Text style={styles.saveButtonText}>診断結果を保存</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  categoryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    minWidth: 30,
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    backgroundColor: '#FF6B6B',
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#999',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 18,
    marginTop: 20,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});