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
import { useFocusEffect } from '@react-navigation/native';

const categoryNames = {
  health: '健康',
  work: '仕事',
  hobby: '趣味',
  relationships: '人間関係',
  learning: '学び',
};

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    try {
      const data = await AsyncStorage.getItem('assessmentHistory');
      if (data) {
        const historyArray = JSON.parse(data);
        setHistory(historyArray.reverse());
      }
    } catch (error) {
      Alert.alert('エラー', 'データの読み込みに失敗しました');
    }
  };

  const clearHistory = () => {
    Alert.alert(
      '履歴削除',
      '本当に全ての履歴を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('assessmentHistory');
              setHistory([]);
              Alert.alert('完了', '履歴を削除しました');
            } catch (error) {
              Alert.alert('エラー', '削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  const getAverageScore = (scores) => {
    const values = Object.values(scores);
    return (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1);
  };

  const getLowestCategory = (scores) => {
    const entries = Object.entries(scores);
    const lowest = entries.reduce((min, current) => 
      current[1] < min[1] ? current : min
    );
    return categoryNames[lowest[0]];
  };

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>診断履歴がありません</Text>
        <Text style={styles.emptySubtext}>診断を実行すると履歴が表示されます</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>診断履歴</Text>
        <TouchableOpacity style={styles.clearButton} onPress={clearHistory}>
          <Text style={styles.clearButtonText}>履歴削除</Text>
        </TouchableOpacity>
      </View>

      {history.map((assessment, index) => (
        <View key={index} style={styles.historyItem}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyDate}>
              {new Date(assessment.date).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </Text>
            <Text style={styles.historyAverage}>
              平均: {getAverageScore(assessment.scores)}/10
            </Text>
          </View>

          <View style={styles.scoresGrid}>
            {Object.entries(assessment.scores).map(([key, value]) => (
              <View key={key} style={styles.scoreCard}>
                <Text style={styles.scoreCategory}>{categoryNames[key]}</Text>
                <Text style={styles.scoreValue}>{Math.round(value)}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.lowestCategory}>
            改善ポイント: {getLowestCategory(assessment.scores)}
          </Text>
        </View>
      ))}

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>📊 統計情報</Text>
        <Text style={styles.summaryText}>
          総診断回数: {history.length}回
        </Text>
        <Text style={styles.summaryText}>
          最初の診断: {new Date(history[history.length - 1]?.date).toLocaleDateString('ja-JP')}
        </Text>
        <Text style={styles.summaryText}>
          最新の診断: {new Date(history[0]?.date).toLocaleDateString('ja-JP')}
        </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyItem: {
    backgroundColor: '#fff',
    margin: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyAverage: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  scoresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  scoreCard: {
    width: '30%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  scoreCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  lowestCategory: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  summary: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 40,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});