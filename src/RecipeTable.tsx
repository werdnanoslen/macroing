import React from 'react';
import { DataRow } from './App';

function RecipeTable({ selectedRecipe, totals, percentages, onRemove, onUpdateServingSize}: any) {
  const handleRemoveClick = (index: number) => {
    // Call the onRemove function with the index of the item to remove
    onRemove(index);
  };

  const handleServingSizeChange = (index: number, newValue: number) => {
    onUpdateServingSize(index, newValue);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Food</th>
            <th>Serving Size</th>
            <th>Protein</th>
            <th>Fat</th>
            <th>Carb</th>
            <th>Fiber</th>
          </tr>
        </thead>
        <tbody>
          {selectedRecipe.map((item: DataRow, index: number) => (
            <tr key={index}>
              <td>{item.food}</td>
              <td>
                <input
                  type="number"
                  value={item.servingsize}
                  onChange={(e) => handleServingSizeChange(index, Number(e.target.value))}
                />
              </td>
              <td>{item.protein.toFixed(2)}</td>
              <td>{item.fat.toFixed(2)}</td>
              <td>{item.carb.toFixed(2)}</td>
              <td>{item.fiber.toFixed(2)}</td>
              <td>
                <button onClick={() => handleRemoveClick(index)}>Remove</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>Percentages</td>
            <td>100%</td>
            <td>{percentages?.protein.toFixed(2)}%</td>
            <td>{percentages?.fat.toFixed(2)}%</td>
            <td>{percentages?.carb.toFixed(2)}%</td>
            <td>{percentages?.fiber.toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RecipeTable;
