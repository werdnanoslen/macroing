import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import RecipeTable from './RecipeTable';
import RecipeMacrosChart from './RecipeMacrosChart';
import './App.css';
import data from './data.json';

export type PercentagesType = {
  protein: number;
  fat: number;
  carb: number;
  fiber: number;
};

export type DataRow = {
  food: string;
  servingsize: number;
  protein: number;
  fat: number;
  carb: number;
  fiber: number;
};
export const COLORS = ['#FF5733', '#33FF57', '#5733FF'];

function App() {
  const [selectedFood, setSelectedFood] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<DataRow[]>([]);
  const [totals, setTotals] = useState({});
  const [percentages, setPercentages] = useState<PercentagesType>();
  const macroTargetsData = [
    { name: 'Protein', value: 30 },
    { name: 'Fat', value: 10 },
    { name: 'Carb', value: 60 },
  ];
  const fiberData = [{ name: 'Fiber', value: 30 }];

  const handleFoodSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFood = event.target.value;
    setSelectedFood(selectedFood);
    const selectedFoodData = data.find((d) => d.food === selectedFood);
    if (selectedFoodData) {
      const updatedSelectedRecipe = [...selectedRecipe, selectedFoodData];
      setSelectedRecipe(updatedSelectedRecipe);
    }
  };

  const handleRemoveItem = (index: number) => {
    const updatedSelectedRecipe = [...selectedRecipe];
    updatedSelectedRecipe.splice(index, 1);
    setSelectedRecipe(updatedSelectedRecipe);
    recalculatePercentages();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recalculatePercentages = () => {
    const totalServingSize = selectedRecipe.reduce(
      (total, food) => total + food.servingsize,
      0,
    );
    const totalProtein = selectedRecipe.reduce(
      (total, food) => total + food.protein,
      0,
    );
    const totalFat = selectedRecipe.reduce(
      (total, food) => total + food.fat,
      0,
    );
    const totalCarb = selectedRecipe.reduce(
      (total, food) => total + food.carb,
      0,
    );
    const totalFiber = selectedRecipe.reduce(
      (total, food) => total + food.fiber,
      0,
    );

    setTotals({
      protein: totalProtein,
      fat: totalFat,
      carb: totalCarb,
      fiber: totalFiber,
      servingsize: totalServingSize,
    });

    const percentageProtein = (totalProtein / totalServingSize) * 100;
    const percentageFat = (totalFat / totalServingSize) * 100;
    const percentageCarb = (totalCarb / totalServingSize) * 100;
    const percentageFiber = (totalFiber / totalServingSize) * 100;

    setPercentages({
      protein: percentageProtein,
      fat: percentageFat,
      carb: percentageCarb,
      fiber: percentageFiber,
    });
  };

  const onUpdateServingSize = (index: number, newValue: number) => {
    const updatedSelectedRecipe = [...selectedRecipe];
    const originalServingSize = updatedSelectedRecipe[index].servingsize;
    const ratio = newValue / originalServingSize;
    updatedSelectedRecipe[index].servingsize = newValue;
    updatedSelectedRecipe[index].protein *= ratio;
    updatedSelectedRecipe[index].fat *= ratio;
    updatedSelectedRecipe[index].carb *= ratio;
    updatedSelectedRecipe[index].fiber *= ratio;
    setSelectedRecipe(updatedSelectedRecipe);
    recalculatePercentages();
  };

  useEffect(() => {
    if (selectedFood) {
      const selectedFoodItem = data.find((item) => item.food === selectedFood);
      if (selectedFoodItem) {
        recalculatePercentages();
      }
    }
  }, [recalculatePercentages, selectedFood, selectedRecipe]);

  return (
    <main>
      <div id="target">
        <h2>Macro Targets</h2>
        <PieChart width={400} height={300}>
          <Pie
            dataKey="value"
            data={macroTargetsData}
            cx={200}
            cy={150}
            outerRadius={100}
            fill="#8884d8"
          >
            {macroTargetsData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
        {/* 
        <h2>Fiber</h2>
        <BarChart width={400} height={300} data={fiberData}>
          <Bar dataKey="value" fill="#8884d8" />
          <Tooltip />
        </BarChart> */}
      </div>
      <div id="recipe">
        <RecipeMacrosChart percentages={percentages} />

        <h2>Recipe</h2>

        <label>Select a Food: </label>
        <select onChange={handleFoodSelect}>
          <option value="">Select</option>
          {data.map((item, index) => {
            if (item.protein + item.fat + item.carb > 0) {
              return (
                <option key={index} value={item.food}>
                  {item.food}
                </option>
              );
            } else {
              return false;
            }
          })}
        </select>

        <RecipeTable
          selectedRecipe={selectedRecipe}
          totals={totals}
          percentages={percentages}
          onRemove={handleRemoveItem}
          onUpdateServingSize={onUpdateServingSize}
        />
      </div>
    </main>
  );
}

export default App;
