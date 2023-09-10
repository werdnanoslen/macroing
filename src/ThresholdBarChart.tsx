import React from 'react';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

const ThresholdBarChart = ({ totals, thresholds }: any) => {
  const data = [
    { name: 'Protein', total: totals.protein, threshold: thresholds.protein },
    { name: 'Fat', total: totals.fat, threshold: thresholds.fat },
    { name: 'Carb', total: totals.carb, threshold: thresholds.carb },
    { name: 'Fiber', total: totals.fiber, threshold: thresholds.fiber },
  ];

  // Define a custom shape for the bars
  const renderCustomBarShape = (props: {
    x: any;
    y: any;
    width: any;
    height: any;
    total: any;
    threshold: any;
  }) => {
    const { x, y, width, height, total, threshold } = props;
    const thresholdY = y + height - (height / total) * threshold;
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill="#8884d8" />
        <line
          x1={x}
          x2={x + width}
          y1={thresholdY}
          y2={thresholdY}
          stroke="#82ca9d"
          strokeWidth={2}
        />
      </g>
    );
  };

  return (
    <div id="threshold-chart">
      <BarChart width={300} height={300} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar
          dataKey="total"
          fill="#8884d8"
          name="Total"
          shape={renderCustomBarShape}
        />
      </BarChart>
    </div>
  );
};

export default ThresholdBarChart;
