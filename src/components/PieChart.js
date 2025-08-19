import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

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
    population: value,
    color: colors[index],
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    useShadowColorFromDataset: false,
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <PieChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute={false}
      />
    </View>
  );
}