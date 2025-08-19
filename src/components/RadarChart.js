import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Polygon, Circle, Text as SvgText, Line } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const chartSize = screenWidth - 80;
const center = chartSize / 2;
const maxRadius = center - 40;

const categoryNames = {
  health: '健康',
  work: '仕事',
  hobby: '趣味',
  relationships: '人間関係',
  learning: '学び',
};

export default function RadarChart({ scores }) {
  if (!scores) return null;

  const categories = Object.keys(scores);
  const values = Object.values(scores);
  const angleStep = (2 * Math.PI) / categories.length;

  const getPoint = (value, index, radius = maxRadius) => {
    const angle = index * angleStep - Math.PI / 2;
    const scaledValue = (value / 10) * radius;
    return {
      x: center + scaledValue * Math.cos(angle),
      y: center + scaledValue * Math.sin(angle),
    };
  };

  const getLabelPoint = (index) => {
    const angle = index * angleStep - Math.PI / 2;
    const labelRadius = maxRadius + 25;
    return {
      x: center + labelRadius * Math.cos(angle),
      y: center + labelRadius * Math.sin(angle),
    };
  };

  const gridPoints = (level) => {
    return categories.map((_, index) => getPoint(level, index));
  };

  const dataPoints = values.map((value, index) => getPoint(value, index));
  const polygonPoints = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
      <Svg width={chartSize} height={chartSize}>
        {[2, 4, 6, 8, 10].map((level) => (
          <Polygon
            key={level}
            points={gridPoints(level).map(p => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="1"
          />
        ))}

        {categories.map((_, index) => (
          <Line
            key={index}
            x1={center}
            y1={center}
            x2={getPoint(10, index).x}
            y2={getPoint(10, index).y}
            stroke="#E0E0E0"
            strokeWidth="1"
          />
        ))}

        <Polygon
          points={polygonPoints}
          fill="rgba(255, 107, 107, 0.3)"
          stroke="#FF6B6B"
          strokeWidth="2"
        />

        {dataPoints.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#FF6B6B"
          />
        ))}

        {categories.map((category, index) => {
          const labelPoint = getLabelPoint(index);
          return (
            <SvgText
              key={category}
              x={labelPoint.x}
              y={labelPoint.y}
              fontSize="12"
              textAnchor="middle"
              alignmentBaseline="middle"
              fill="#333"
            >
              {categoryNames[category]}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}