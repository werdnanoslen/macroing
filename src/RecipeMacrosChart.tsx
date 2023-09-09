import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import React from 'react';
import { COLORS } from './App';

function RecipeMacrosChart({ percentages }: any) {
  const data = [
    { name: 'Protein', value: percentages?.protein },
    { name: 'Fat', value: percentages?.fat },
    { name: 'Carb', value: percentages?.carb },
  ];

  return (
    <div>
      <h2>Recipe Macros</h2>
      <PieChart width={400} height={300}>
        <Pie
          dataKey="value"
          data={data}
          cx={200}
          cy={150}
          outerRadius={100}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default RecipeMacrosChart;
