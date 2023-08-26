import React from 'react';

import { IngredientListProps } from '../../types';

import './IngredientList.css';

const IngredientList: React.FC<IngredientListProps> = ({ ingredients, onRemoveItem }) => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {ingredients.map(ig => (
          <li key={ig.id} onClick={onRemoveItem.bind(null, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  )
};

export default IngredientList;
