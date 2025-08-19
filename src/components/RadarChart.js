import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const categoryNames = {
  health: '健康',
  work: '仕事',
  hobby: '趣味',
  relationships: '人間関係',
  learning: '学び',
};

export default function RadarChart({ scores }) {
  if (!scores) return null;

  const data = Object.entries(scores).map(([key, value]) => ({
    name: categoryNames[key],
    value: value,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>各項目のバランス</Text>
      
      <View style={styles.radarContainer}>
        {data.map((item, index) => {
          const percentage = (item.value / 10) * 100;
          return (
            <View key={index} style={styles.radarItem}>
              <View style={styles.labelContainer}>
                <Text style={styles.categoryLabel}>{item.name}</Text>
                <Text style={styles.scoreLabel}>{Math.round(item.value)}/10</Text>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBackground}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${percentage}%` }
                    ]} 
                  />
                </View>
                <View style={styles.scaleMarkers}>
                  {[2, 4, 6, 8, 10].map((mark) => (
                    <View 
                      key={mark}
                      style={[
                        styles.scaleMark,
                        { left: `${(mark / 10) * 100 - 1}%` }
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          );
        })}
      </View>
      
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleText}>低い</Text>
        <Text style={styles.scaleText}>2</Text>
        <Text style={styles.scaleText}>4</Text>
        <Text style={styles.scaleText}>6</Text>
        <Text style={styles.scaleText}>8</Text>
        <Text style={styles.scaleText}>高い</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  radarContainer: {
    marginBottom: 20,
  },
  radarItem: {
    marginBottom: 25,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  progressContainer: {
    position: 'relative',
  },
  progressBackground: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 6,
  },
  scaleMarkers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 12,
  },
  scaleMark: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#fff',
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  scaleText: {
    fontSize: 12,
    color: '#999',
  },
});