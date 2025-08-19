import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const colors = [
  '#FF6B6B', // 健康
  '#4ECDC4', // 仕事
  '#45B7D1', // 趣味
  '#96CEB4', // 人間関係
  '#FFEAA7', // 学び
];

const categoryNames = {
  health: '健康',
  work: '仕事',
  hobby: '趣味',
  relationships: '人間関係',
  learning: '学び',
};

export default function LifeBalancePieChart({ scores }) {
  if (!scores) return null;

  const data = Object.entries(scores).map(([key, value], index) => ({
    name: categoryNames[key],
    value: value,
    color: colors[index],
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          return (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.colorBox, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.name}: {Math.round(item.value)} ({percentage.toFixed(1)}%)
              </Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.barsContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barItem}>
            <Text style={styles.barLabel}>{item.name}</Text>
            <View style={styles.barBackground}>
              <View 
                style={[
                  styles.barFill, 
                  { 
                    width: `${(item.value / 10) * 100}%`,
                    backgroundColor: item.color 
                  }
                ]} 
              />
            </View>
            <Text style={styles.barValue}>{Math.round(item.value)}/10</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartContainer: {
    width: '100%',
    marginBottom: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  colorBox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
  barsContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  barItem: {
    marginBottom: 15,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  barBackground: {
    height: 25,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
  },
  barValue: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 2,
  },
});