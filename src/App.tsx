import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import RecipeTable from './RecipeTable';
import RecipeMacrosChart from './RecipeMacrosChart'
import './App.css';
import data from './data.json';

export type PercentagesType = {
  protein: number,
  fat: number,
  carb: number,
  fiber: number,
}

export type DataRow = {
  food: string,
  servingsize: number,
  protein: number,
  fat: number,
  carb: number,
  fiber: number,
}

function App () {
  const [selectedFood, setSelectedFood] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<DataRow[] | []>([]);
  const [totals, setTotals] = useState({});
  const [percentages, setPercentages] = useState<PercentagesType>();

  const macroTargetsData = [
    { name: 'Protein', value: 30 },
    { name: 'Fat', value: 10 },
    { name: 'Carb', value: 60 },
  ];

  const fiberData = [
    { name: 'Fiber', value: 30 },
  ];

  const COLORS = ['#FF5733', '#33FF57', '#5733FF'];

  useEffect(() => {
    if (selectedFood) {
      // Find the selected food item in your data
      const selectedFoodItem = data.find((item) => item.food === selectedFood);
  
      if (selectedFoodItem) {
        recalculatePercentages([selectedFoodItem])
      }
    }
  }, [selectedFood, selectedRecipe]);

  const handleFoodSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFood = event.target.value;
    setSelectedFood(selectedFood);

    // Find the corresponding data in the JSON and add it to the selectedRecipe
    const selectedFoodData = data.find((d) => d.food === selectedFood);

    if (selectedFoodData) {
      // Create a copy of the selectedRecipe array and add the selected food data to it
      const updatedSelectedRecipe = [...selectedRecipe, selectedFoodData];

      // Update the selectedRecipe state with the new array
      setSelectedRecipe(updatedSelectedRecipe);
    }
  };

  const handleRemoveItem = (index: number) => {
    // Create a copy of the selectedRecipe array and remove the item at the specified index
    const updatedSelectedRecipe = [...selectedRecipe];
    updatedSelectedRecipe.splice(index, 1);

    // Update the selectedRecipe state with the new array
    setSelectedRecipe(updatedSelectedRecipe);

    // Call the recalculatePercentages function to update percentages
    recalculatePercentages(updatedSelectedRecipe);
  };

  const recalculatePercentages = (recipe: DataRow[]) => {
    let totalProtein = 0
    let totalFat = 0
    let totalCarb = 0
    let totalFiber = 0
    let totalServingSize = 0

    // Calculate totals
    for (let i = 0; i < selectedRecipe.length; i++) {
      const food = selectedRecipe[i];
      totalServingSize += food.servingsize
      totalProtein += food.protein
      totalFat += food.fat
      totalCarb += food.carb
      totalFiber += food.fiber
    }

    setTotals({
      protein: totalProtein,
      fat: totalFat,
      carb: totalCarb,
      fiber: totalFiber,
      servingsize: totalServingSize,
    });

    // Calculate percentages
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
    // // Calculate totals and percentages based on the updated recipe
    // // You can reuse the code you previously used in useEffect here

    // // Example code (update this with your actual calculations):
    // const totalProtein = recipe.reduce((total, item) => total + item.protein, 0);
    // const totalFat = recipe.reduce((total, item) => total + item.fat, 0);
    // const totalCarb = recipe.reduce((total, item) => total + item.carb, 0);
    // const totalFiber = recipe.reduce((total, item) => total + item.fiber, 0);
    // const totalServingSize = recipe.reduce((total, item) => total + item.servingsize, 0);

    // const percentageProtein = (totalProtein / totalServingSize) * 100;
    // const percentageFat = (totalFat / totalServingSize) * 100;
    // const percentageCarb = (totalCarb / totalServingSize) * 100;
    // const percentageFiber = (totalFiber / totalServingSize) * 100;

    // setTotals({
    //   protein: totalProtein,
    //   fat: totalFat,
    //   carb: totalCarb,
    //   fiber: totalFiber,
    //   servingsize: totalServingSize,
    // });

    // setPercentages({
    //   protein: percentageProtein,
    //   fat: percentageFat,
    //   carb: percentageCarb,
    //   fiber: percentageFiber,
    // });
  };

  // Define the onUpdateServingSize function
  const onUpdateServingSize = (index: number, newValue: number) => {
    // Create a copy of the selectedRecipe array
    const updatedSelectedRecipe = [...selectedRecipe];

    // Get the original serving size of the item at the specified index
    const originalServingSize = updatedSelectedRecipe[index].servingsize;

    // Calculate the ratio of the new serving size to the original serving size
    const ratio = newValue / originalServingSize;

    // Update the serving size of the item
    updatedSelectedRecipe[index].servingsize = newValue;

    // Update the protein, fat, carb, and fiber values proportionally
    updatedSelectedRecipe[index].protein *= ratio;
    updatedSelectedRecipe[index].fat *= ratio;
    updatedSelectedRecipe[index].carb *= ratio;
    updatedSelectedRecipe[index].fiber *= ratio;

    // Update the selectedRecipe state with the new array
    setSelectedRecipe(updatedSelectedRecipe);

    // Recalculate percentages with the updated recipe
    recalculatePercentages(updatedSelectedRecipe); 
  };

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
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
              )
            } else {
              return false
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
};

export default App;
