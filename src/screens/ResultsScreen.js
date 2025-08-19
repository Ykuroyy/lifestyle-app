import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PieChart from '../components/PieChart';
import RadarChart from '../components/RadarChart';
import { generateAdvice, getOverallBalance } from '../utils/adviceGenerator';

const categoryNames = {
  health: '健康',
  work: '仕事',
  hobby: '趣味',
  relationships: '人間関係',
  learning: '学び',
};

export default function ResultsScreen({ route }) {
  const [assessmentData, setAssessmentData] = useState(null);
  const [chartType, setChartType] = useState('pie');

  useEffect(() => {
    loadLatestAssessment();
  }, [route.params]);

  const loadLatestAssessment = async () => {
    try {
      const data = await AsyncStorage.getItem('latestAssessment');
      if (data) {
        setAssessmentData(JSON.parse(data));
      }
    } catch (error) {
      Alert.alert('エラー', 'データの読み込みに失敗しました');
    }
  };

  if (!assessmentData) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>まだ診断結果がありません</Text>
        <Text style={styles.emptySubtext}>「診断」タブから始めてみましょう！</Text>
      </View>
    );
  }

  const advice = generateAdvice(assessmentData.scores);
  const overallBalance = getOverallBalance(assessmentData.scores);
  const assessmentDate = new Date(assessmentData.date).toLocaleDateString('ja-JP');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ライフバランス診断結果</Text>
        <Text style={styles.date}>{assessmentDate}</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>総合バランス</Text>
        <Text style={styles.balanceMessage}>{overallBalance.message}</Text>
        <Text style={styles.balanceScore}>
          平均スコア: {overallBalance.average}/10
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, chartType === 'pie' && styles.activeToggle]}
            onPress={() => setChartType('pie')}
          >
            <Text style={[styles.toggleText, chartType === 'pie' && styles.activeToggleText]}>
              円グラフ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, chartType === 'radar' && styles.activeToggle]}
            onPress={() => setChartType('radar')}
          >
            <Text style={[styles.toggleText, chartType === 'radar' && styles.activeToggleText]}>
              レーダーチャート
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chart}>
          {chartType === 'pie' ? (
            <PieChart scores={assessmentData.scores} />
          ) : (
            <RadarChart scores={assessmentData.scores} />
          )}
        </View>
      </View>

      <View style={styles.scoresContainer}>
        <Text style={styles.scoresTitle}>各項目のスコア</Text>
        {Object.entries(assessmentData.scores).map(([key, value]) => (
          <View key={key} style={styles.scoreItem}>
            <Text style={styles.scoreCategory}>{categoryNames[key]}</Text>
            <View style={styles.scoreBar}>
              <View 
                style={[styles.scoreProgress, { width: `${(value / 10) * 100}%` }]} 
              />
              <Text style={styles.scoreValue}>{Math.round(value)}/10</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.adviceContainer}>
        <Text style={styles.adviceTitle}>📝 改善アドバイス</Text>
        {advice.map((item, index) => (
          <View key={index} style={styles.adviceItem}>
            <View style={styles.adviceHeader}>
              <Text style={styles.adviceCategory}>{categoryNames[item.category]}</Text>
              <Text style={styles.adviceScore}>{Math.round(item.score)}/10</Text>
            </View>
            <Text style={styles.adviceText}>{item.advice}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  balanceCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  balanceMessage: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 10,
  },
  balanceScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartToggle: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeToggle: {
    backgroundColor: '#FF6B6B',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  activeToggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  chart: {
    paddingBottom: 20,
  },
  scoresContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  scoreItem: {
    marginBottom: 15,
  },
  scoreCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  scoreBar: {
    height: 30,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    position: 'relative',
    justifyContent: 'center',
  },
  scoreProgress: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 15,
    position: 'absolute',
    left: 0,
  },
  scoreValue: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  adviceContainer: {
    margin: 20,
    marginBottom: 40,
  },
  adviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  adviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  adviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  adviceCategory: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  adviceScore: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  adviceText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});