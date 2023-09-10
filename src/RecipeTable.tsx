import React from 'react';
import { DataRow } from './App';

function RecipeTable({
  selectedRecipe,
  totals,
  percentages,
  onRemove,
  onUpdateServingSize,
}: any) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Food</th>
            <th>Serving Size (g)</th>
            <th>Protein (g)</th>
            <th>Fat (g)</th>
            <th>Carb (g)</th>
            <th>Fiber (g)</th>
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
                  onChange={(e) =>
                    onUpdateServingSize(index, Number(e.target.value))
                  }
                />
              </td>
              <td>{item.protein.toFixed(1)}</td>
              <td>{item.fat.toFixed(1)}</td>
              <td>{item.carb.toFixed(1)}</td>
              <td>{item.fiber.toFixed(1)}</td>
              <td>
                <button onClick={() => onRemove(index)}>Remove</button>
              </td>
            </tr>
          ))}
          <tr>
            <td>Totals</td>
            <td>{totals?.servingsize.toFixed(1)}</td>
            <td>{totals?.protein.toFixed(1)}</td>
            <td>{totals?.fat.toFixed(1)}</td>
            <td>{totals?.carb.toFixed(1)}</td>
            <td>{totals?.fiber.toFixed(1)}</td>
          </tr>
          <tr>
            <td>Percentages</td>
            <td>100%</td>
            <td>{percentages?.protein.toFixed(1)}%</td>
            <td>{percentages?.fat.toFixed(1)}%</td>
            <td>{percentages?.carb.toFixed(1)}%</td>
            <td>{percentages?.fiber.toFixed(1)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RecipeTable;
