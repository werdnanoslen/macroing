import { PieChart, Pie, Cell, Legend } from 'recharts';
import React from 'react';
import { COLORS } from './App';

function RecipeMacrosChart({ percentages }: any) {
  const data = [
    { name: 'Protein', value: percentages?.protein },
    { name: 'Fat', value: percentages?.fat },
    { name: 'Carb', value: percentages?.carb },
  ];

  return (
    <div id="recipe-chart">
      <PieChart width={300} height={300}>
        <Pie dataKey="value" data={data} cx={150} cy={150} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </div>
  );
}

export default RecipeMacrosChart;
