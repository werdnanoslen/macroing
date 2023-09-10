import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import RecipeTable from './RecipeTable';
import RecipeMacrosChart from './RecipeMacrosChart';
import './App.css';

export type PercentagesType = {
  servingsize?: number;
  protein: number;
  fat: number;
  carb: number;
  fiber: number;
};

export type DataRow = {
  id: number;
  food: string;
  servingsize: number;
  protein: number;
  fat: number;
  carb: number;
  fiber: number;
};
export const COLORS = ['#FF5733', '#33FF57', '#5733FF'];

function App() {
  const [selectedRecipe, setSelectedRecipe] = useState<DataRow[]>([]);
  const [totals, setTotals] = useState<PercentagesType>();
  const [percentages, setPercentages] = useState<PercentagesType>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const macroTargetsData = [
    { name: 'Protein', value: 30 },
    { name: 'Fat', value: 10 },
    { name: 'Carb', value: 60 },
  ];
  const fiberData = [{ name: 'Fiber', value: 30 }];
  let searchTimeout: any;

  const handleRemoveItem = (index: number) => {
    const updatedSelectedRecipe = [...selectedRecipe];
    updatedSelectedRecipe.splice(index, 1);
    setSelectedRecipe(updatedSelectedRecipe);
    recalculatePercentages();
  };

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
  };

  // Some foods via the search endpoint don't share servingsize, so this is the backup for those cases
  const searchFoodDetails = async (id: number) => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${id}?api_key=${apiKey}`,
      );
      const data = await response.json();
      if (data) {
        const portions = data.foodPortions;
        if (portions.length > 0) {
          return portions[0].gramWeight;
        } else {
          let talliedWeight = 0;
          for (let i = 0; i < data.inputFoods.length; i++) {
            const inputFood = data.inputFoods[i];
            talliedWeight += inputFood.ingredientWeight;
          }
          return talliedWeight;
        }
      }
    } catch (error) {
      console.error('Error fetching data from the API:', error);
    }
  };

  const searchFoods = async (query: string) => {
    try {
      const apiKey = process.env.REACT_APP_API_KEY;
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${apiKey}`,
      );
      const data = await response.json();
      if (data.foods && data.foods.length > 0) {
        setSearchResults(data.foods);
      }
    } catch (error) {
      console.error('Error fetching data from the API:', error);
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const query = event.target.value;
    setSearchQuery(query);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchFoods(query);
    }, 500);
  };

  const handleSearchResultClick = async (foodItem: any) => {
    let newFood: DataRow = {
      id: 0,
      food: '',
      servingsize: 0,
      protein: 0,
      fat: 0,
      carb: 0,
      fiber: 0,
    };
    newFood.id = foodItem.fdcId;
    newFood.food = foodItem.description.toLowerCase();
    newFood.servingsize =
      Number(foodItem.servingSize) || (await searchFoodDetails(foodItem.fdcId));
    for (
      let counter = 0, i = 0;
      counter < 4 && i < foodItem.foodNutrients.length;
      i++
    ) {
      const nutrient = foodItem.foodNutrients[i];
      const name = nutrient.nutrientName;
      const value = (Number(nutrient.value) * newFood.servingsize) / 100; //api returns nutrients per 100g regardless of servingsize
      switch (name) {
        case 'Protein':
          newFood.protein = value;
          counter++;
          break;
        case 'Total lipid (fat)':
          newFood.fat = value;
          counter++;
          break;
        case 'Carbohydrate, by difference':
          newFood.carb = value;
          counter++;
          break;
        case 'Fiber, total dietary':
          newFood.fiber = value;
          counter++;
          break;
      }
    }
    const updatedSelectedRecipe = [...selectedRecipe, newFood];
    setSearchQuery('');
    setSearchResults([]);
    setSelectedRecipe(updatedSelectedRecipe);
  };

  useEffect(() => {
    if (selectedRecipe) recalculatePercentages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecipe]);

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
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <ul className="search-results">
          {searchResults.map((foodItem, index) => (
            <li
              key={index}
              className="search-result"
              onClick={() => handleSearchResultClick(foodItem)}
            >
              {foodItem.description.toLowerCase()}
            </li>
          ))}
        </ul>

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
